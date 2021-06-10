import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  Group,
  GroupCreateInput,
  GroupType,
  GroupUpdateInput,
} from "./entities";
import { CodeWord } from "@server/src/group/code-word";
import Handlebars = require("handlebars");
import { readFileSync } from "fs";
import { SendMailInput } from "@server/src/mail/entities";
import { MailService } from "@server/src/mail/mail.service";
import * as path from "path";
import { DateTime } from "luxon";
import { getDebugger } from "@helpers/debug-factory";
import { BaseService } from "@server/src/shared/base.service";

const debug = getDebugger("group");

@Injectable()
export class GroupService {
  private readonly groupAdminTextTemplate;
  private readonly groupAdminHtmlTemplate;

  constructor(
    private readonly mailService: MailService,
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>
  ) {
    this.groupAdminTextTemplate = GroupService.compileTemplate(
      "server/group/letters/group-admin.txt"
    );
    this.groupAdminHtmlTemplate = GroupService.compileTemplate(
      "server/group/letters/group-admin.html"
    );
  }

  /**
   * Compile a template.
   * @param relativePath Relative path to template from `.../dist/apps/`.
   * @private
   */
  private static compileTemplate(relativePath: string) {
    const templatePath = path.join(__dirname, "..", relativePath);
    debug("template '%s'", templatePath);
    return Handlebars.compile(readFileSync(templatePath, "utf-8"));
  }

  // Generate a code word that doesn't already exist.
  private async generateUniqueCodeWord() {
    let tries = 100;
    while (tries--) {
      const codeWord = CodeWord.generate();
      const existingGroup = await this.groupRepo.findOne({ codeWord });
      if (existingGroup) {
        console.warn(
          `Code word '${codeWord}' already exists; ${tries} more tries`
        );
      } else {
        return codeWord;
      }
    }
    throw new Error("Failed to generate unique code word");
  }

  async create(createInput: GroupCreateInput): Promise<Group> {
    // Create the new group, including a code word that hasn't been used.
    const group = await this.groupRepo.save(
      this.groupRepo.create({
        ...createInput,
        closedAfter: DateTime.fromISO(createInput.closedAfter).toLocaleString(
          DateTime.DATE_FULL
        ),
        codeWord: await this.generateUniqueCodeWord(),
      })
    );

    // Fetch the new group and related data for the admin email.
    const groupPlus = await this.groupRepo.findOneOrFail(group.id, {
      relations: ["survey"],
    });

    if (!process.env.TU_C4SE_URL) {
      console.error("No C4SE URL configured");
    }
    if (!process.env.TU_CLS_URL) {
      console.error("No CLS URL configured");
    }

    const groupDetails = {
      ...groupPlus,
      tuC4seUrl: process.env.TU_C4SE_URL,
      tuClsUrl: process.env.TU_CLS_URL,
    };
    debug("createGroup/groupDetails %O", groupDetails);

    // Send email to group administrator.
    const mailDetails = new SendMailInput();
    mailDetails.from = "";
    mailDetails.to = groupDetails.adminEmail;
    mailDetails.subject = "Christian Life Survey Group Sign-up";
    mailDetails.htmlContent = this.groupAdminHtmlTemplate(groupDetails);
    mailDetails.textContent = this.groupAdminTextTemplate(groupDetails);
    await this.mailService.sendMail(mailDetails);
    debug("sent email");

    return groupDetails;
  }

  // Always resolve these relations.
  private alwaysResolve = ["type", "survey", "surveyResponses"];

  readAll() {
    return this.groupRepo.find({
      relations: this.alwaysResolve,
    });
  }

  readOne(id: number): Promise<Group> {
    return this.groupRepo.findOne(id, {
      relations: this.alwaysResolve,
    });
  }

  findByCodeWord(codeWord: string) {
    return this.groupRepo.findOne({ codeWord });
  }

  update(updateInput: GroupUpdateInput): Promise<Group> {
    return this.groupRepo
      .preload(updateInput)
      .then((result) => this.groupRepo.save(result));
  }

  delete(id: number) {
    debug("deleting group %d", id);
    return this.groupRepo.delete(id);
  }
}

@Injectable()
export class GroupTypeService extends BaseService<GroupType> {
  constructor(
    @InjectRepository(GroupType)
    private readonly repo: Repository<GroupType>
  ) {
    super(repo);
  }

  readAll(): Promise<GroupType[]> {
    return this.repo.find({ order: { seq: "ASC" } });
  }

  readOne(id: number) {
    return this.repo.findOne(id);
  }
}
