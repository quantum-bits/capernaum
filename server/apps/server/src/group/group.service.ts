import { Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
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
import debug from "debug";
import * as path from "path";
import { DateTime } from "luxon";

const groupDebug = debug("group");

@Injectable()
export class GroupService extends BaseService {
  private readonly groupAdminTextTemplate;
  private readonly groupAdminHtmlTemplate;

  constructor(
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
    private readonly mailService: MailService
  ) {
    super();

    this.groupAdminTextTemplate = GroupService.compileTemplate(
      "letters/group-admin.txt"
    );
    this.groupAdminHtmlTemplate = GroupService.compileTemplate(
      "letters/group-admin.html"
    );
  }

  private static compileTemplate(fileName: string) {
    const templatePath = path.join(__dirname, fileName);
    groupDebug("Compiling %s", templatePath);
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

  async createGroup(createInput: GroupCreateInput): Promise<Group> {
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
    groupDebug("createGroup/groupDetails %O", groupDetails);

    // Send email to group administrator.
    const mailDetails = new SendMailInput();
    mailDetails.from = "";
    mailDetails.to = groupDetails.adminEmail;
    mailDetails.subject = "Christian Life Survey Group Sign-up";
    mailDetails.htmlContent = this.groupAdminHtmlTemplate(groupDetails);
    mailDetails.textContent = this.groupAdminTextTemplate(groupDetails);
    await this.mailService.sendMail(mailDetails);
    groupDebug("sent email");

    return group;
  }

  readGroups() {
    groupDebug("groupRepo %O", this.groupRepo);
    return this.groupRepo
      .find({
        relations: ["type", "survey", "surveyResponses"],
      })
      .then((result) => {
        groupDebug("readGroups %O", result);
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  readGroup(id: number): Promise<Group> {
    return this.groupRepo.findOne(id, {
      relations: ["type", "survey", "surveyResponses"],
    });
  }

  findGroupByCodeWord(codeWord: string) {
    return this.groupRepo.findOne({ codeWord });
  }

  updateGroup(updateInput: GroupUpdateInput): Promise<Group> {
    return this.groupRepo
      .preload(updateInput)
      .then((result) => this.groupRepo.save(result));
  }

  deleteGroup(id: number) {
    groupDebug("deleting group %d", id);
    return this.groupRepo.delete(id);
  }
}

@Injectable()
export class GroupTypeService {
  constructor(
    @InjectRepository(GroupType)
    private readonly groupTypeRepo: Repository<GroupType>
  ) {}

  readGroupTypes(): Promise<GroupType[]> {
    return this.groupTypeRepo.find({ order: { seq: "ASC" } });
  }

  readGroupType(id: number) {
    return this.groupTypeRepo.findOne(id);
  }
}
