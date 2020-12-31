import { Inject, Injectable } from "@nestjs/common";
import faker from "faker";
import { CodeWord, Group, GroupCreateInput } from "@server/src/group/entities";
import { SurveyFabricatorService } from "@server/src/fabricator/survey-fabricator.service";
import {
  AbstractFabricatorService,
  FabricatedData,
} from "@server/src/fabricator/abstract-fabricator.service";

@Injectable()
export class GroupFabricatorService extends AbstractFabricatorService {
  @Inject(SurveyFabricatorService)
  private readonly surveyFabricatorService: SurveyFabricatorService;

  fabricateGroup(): FabricatedData {
    return this.verifyFabricatedData(Group, {
      name: faker.company.companyName(),
      type: faker.random.arrayElement([
        "Sunday School",
        "Small Group",
        "Bible Study",
      ]),
      closedAfter: faker.date.soon(14).toISOString(),
      adminFirstName: faker.name.firstName(),
      adminLastName: faker.name.lastName(),
      adminEmail: faker.internet.email(),
      codeWord: CodeWord.generate(),
    });
  }

  // This works, but just seems so awful.
  async create(count = 1): Promise<Group[]> {
    const groups: Group[] = [];
    for (let i = 0; i < count; i++) {
      const survey = await this.surveyFabricatorService.createSurvey();
      const group = this.entityMgr.create(
        Group,
        this.fabricateGroup()
      );
      group.survey = survey;
      groups.push(await this.entityMgr.save(group));
    }
    return groups;
  }

  /* This version using async.js works, but the type declaration for `times` seems wrong.
     Question posted to https://stackoverflow.com/questions/65516225/incorrect-typing-for-times-function

  create(count = 1) {
    return times<Group>(count, (n, next) =>
      this.surveyFabricatorService
        .createSurvey()
        .then((survey) =>
          this.entityMgr.save<Group>(
            this.entityMgr.create(Group, this.fabricateGroup(survey.id))
          )
        )
        .then((group) => next(null, group))
    );
  }
  */
}
