import { Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Group, GroupCreateInput, GroupUpdateInput } from "./entities";
import { CodeWord } from "@server/src/group/code-word";
import Handlebars from "handlebars";
import { readFileSync } from "fs";
import { SendMailInput } from "@server/src/mail/entities";
import { MailService } from "@server/src/mail/mail.service";
import debug from "debug";
import path from "path";

const groupDebug = debug("group");

@Injectable()
export class GroupService extends BaseService {
  private readonly groupAdminTemplate;

  constructor(
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
    private readonly mailService: MailService
  ) {
    super();

    const templatePath = path.join(__dirname, "letters/group-admin.txt");
    groupDebug("Compiling %s", templatePath);
    this.groupAdminTemplate = Handlebars.compile(
      readFileSync(templatePath, "utf-8")
    );
  }

  async createGroup(createInput: GroupCreateInput): Promise<Group> {
    const codeWord = CodeWord.generate(); // We generate the code word.
    // Persist to the database.
    const groupDetails = {
      ...createInput,
      codeWord,
    };
    groupDebug("createGroup %O", groupDetails);
    const group = await this.groupRepo.save(
      this.groupRepo.create(groupDetails)
    );

    // Send email to group administrator.
    const mailDetails = new SendMailInput();
    mailDetails.from = "";
    mailDetails.to = groupDetails.adminEmail;
    mailDetails.subject = "Christian Life Survey Group Sign-up";
    mailDetails.textContent = this.groupAdminTemplate(groupDetails);
    await this.mailService.sendMail(mailDetails);
    groupDebug("sent email");

    return group;
  }

  readGroups(): Promise<Group[]> {
    return this.groupRepo.find({ relations: ["survey"] });
  }

  readGroup(id: number): Promise<Group> {
    return this.groupRepo.findOne(id, {
      relations: ["survey", "surveyResponses"],
    });
  }

  updateGroup(updateInput: GroupUpdateInput): Promise<Group> {
    return this.groupRepo
      .preload(updateInput)
      .then((result) => this.groupRepo.save(result));
  }
}
