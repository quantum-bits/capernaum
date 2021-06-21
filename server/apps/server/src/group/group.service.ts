import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, MoreThan, Repository } from "typeorm";
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
import { getDebugger } from "@helpers/debug-factory";
import { BaseService } from "@server/src/shared/base.service";
import { DateTime } from "luxon";
import { SurveyService } from "@server/src/survey/services";

const debug = getDebugger("group");

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

@Injectable()
export class GroupService {
  private readonly groupAdminTextTemplate;
  private readonly groupAdminHtmlTemplate;

  constructor(
    private readonly mailService: MailService,
    private readonly groupTypeService: GroupTypeService,
    @Inject(forwardRef(() => SurveyService))
    private readonly surveyService: SurveyService,
    @InjectRepository(Group)
    private readonly repo: Repository<Group>
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
      const existingGroup = await this.repo.findOne({ codeWord });
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

  async create(createInput: GroupCreateInput) {
    debug("createInput %O", createInput);

    // Create the new group, including a code word that hasn't been used.
    const survey = await this.surveyService.readOne(createInput.surveyId);
    const groupType = await this.groupTypeService.readOne(createInput.typeId);
    const group = await this.repo.save(
      this.repo.create({
        ...createInput,
        survey,
        type: groupType,
        codeWord: await this.generateUniqueCodeWord(),
      })
    );
    debug("group %O", group);

    // Fetch the new group and related data for the admin email.
    const groupPlus = await this.repo.findOneOrFail(group.id, {
      relations: ["survey", "type"],
    });
    debug("groupPlus %O", groupPlus);

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

    return groupPlus;
  }

  // Always resolve these relations.
  private alwaysResolve = ["type", "survey", "surveyResponses"];

  readAll() {
    return this.repo.find({
      relations: this.alwaysResolve,
    });
  }

  readOne(id: number): Promise<Group> {
    return this.repo.findOne(id, {
      relations: this.alwaysResolve,
    });
  }

  findByCodeWord(codeWord: string) {
    return this.repo.findOne({ codeWord });
  }

  /**
   * Find all "open" groups -- those with a close date in the future
   * and whose group report has not been sent.
   */
  findOpen() {
    const now = DateTime.now().toString();
    debug("Check for groups open as of %s", now);
    return this.repo.find({
      closedAfter: MoreThan(now),
      reportSent: null,
    });
  }

  /**
   * Find groups ready to have a group report created and sent.
   */
  findReadyForReport() {
    const now = DateTime.now().toString();
    debug("Check for ready to report groups as of %s", now);
    return this.repo.find({
      closedAfter: LessThan(now),
      reportSent: null,
    });
  }

  /**
   * Force group `groupId` into a state where it's ready to report.
   * @param groupId
   */
  forceReport(groupId: number) {
    const now = DateTime.now();
    debug("Set 'closed after' to %s", now);
    return this.repo.update(groupId, { closedAfter: now });
  }

  /**
   * Close group `groupId` completely. No report generated.
   * @param groupId
   */
  closeGroup(groupId: number) {
    const now = DateTime.now().toString();
    debug("Mark group %d as closed as of %s", groupId, now);
    return this.repo.update(groupId, { reportSent: now });
  }

  async countResponses(groupId: number) {
    const result = await this.repo
      .createQueryBuilder("grp")
      .innerJoin("grp.surveyResponses", "sr")
      .where("grp.id = :groupId", { groupId })
      .select("COUNT(*) AS response_count")
      .getRawOne();
    debug("countResponses %O", result);
    return parseInt(result.response_count);
  }

  update(updateInput: GroupUpdateInput): Promise<Group> {
    return this.repo
      .preload(updateInput)
      .then((result) => this.repo.save(result));
  }

  delete(id: number) {
    debug("deleting group %d", id);
    return this.repo.delete(id);
  }
}
