import { Inject, Injectable } from "@nestjs/common";
import faker from "faker";
import { Group } from "@server/src/group/entities";
import { AbstractFabricatorService } from "@server/src/fabricator/abstract-fabricator.service";
import { SurveyFabricatorService } from "@server/src/fabricator/survey-fabricator.service";
import { CodeWord } from "@server/src/group/code-word";
import { Survey, SurveyResponse } from "@server/src/survey/entities";
import Chance from "chance";
const chance = new Chance();

export interface GroupWithSurveysFixture {
  group: Group;
  survey: Survey;
  surveyResponses: SurveyResponse[];
}

@Injectable()
export class GroupFabricatorService extends AbstractFabricatorService {
  @Inject(SurveyFabricatorService)
  private readonly surveyFabricatorService: SurveyFabricatorService;

  fabricateGroup(): Group {
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
  async dbCreate(count = 1): Promise<Group[]> {
    const groups: Group[] = [];
    for (let i = 0; i < count; i++) {
      const survey = await this.surveyFabricatorService.dbCreateSurvey();
      const group = this.entityMgr.create(Group, this.fabricateGroup());
      group.survey = survey;
      groups.push(await this.entityMgr.save(group));
    }
    return groups;
  }

  async prepareGroupWithSurveysFixture(): Promise<GroupWithSurveysFixture> {
    const survey = await this.surveyFabricatorService.dbCreateSurvey();
    const groupData = this.fabricateGroup();
    groupData.survey = survey;
    const group = await this.entityMgr.save(Group, groupData);

    const numResponses = chance.natural({ min: 10, max: 20 });
    const surveyResponses: SurveyResponse[] = [];
    for (let i = 0; i < numResponses; i++) {
      const surveyResponseData = this.surveyFabricatorService.fabricateSurveyResponse();
      surveyResponseData.survey = survey;
      surveyResponseData.group = group;
      const surveyResponse = await this.entityMgr.save(
        SurveyResponse,
        surveyResponseData
      );
      surveyResponses.push(surveyResponse);
    }

    return {
      group,
      survey,
      surveyResponses,
    };
  }
}
