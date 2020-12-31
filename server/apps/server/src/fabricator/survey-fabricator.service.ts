import { Injectable } from "@nestjs/common";
import faker from "faker";
import { CodeWord, Group, GroupCreateInput } from "@server/src/group/entities";
import { Survey, SurveyResponse } from "@server/src/survey/entities";
import {
  AbstractFabricatorService,
  FabricatedData,
} from "./abstract-fabricator.service";

export interface SurveyFabricatorOptions {
  groupId: number | null;
  numSurveys: number;
  numResponsesPerSurvey: number;
}

@Injectable()
export class SurveyFabricatorService extends AbstractFabricatorService {
  fabricateSurvey(): FabricatedData {
    const fields: FabricatedData = {
      qualtricsId: `QID-${faker.random.number({ min: 100000, max: 999999 })}`,
      qualtricsName: faker.lorem.word(2),
      qualtricsModDate: faker.date.past(1).toISOString(),
      emailKey: "EMAIL",
      groupCodeKey: "GROUP_CODE",
      okayForGroup: true,
      publicName: `Survey ${faker.lorem.word(3)}`,
      detailedDescription: faker.lorem.paragraph(),
      // surveyItems: [],
    };
    this.verifyFabricatedData(Survey, fields);
    return fields;
  }

  fabricateSurveyResponse(surveyId: number, groupId?: number): FabricatedData {
    const fields: FabricatedData = {
      surveyId,
      // surveyItemResponses: [],
      email: faker.internet.email(),
      codeWord: CodeWord.generate(),
      qualtricsResponseId: "Q123",
      startDate: faker.date.recent().toISOString(),
      endDate: faker.date.recent().toISOString(),
      recordedDate: faker.date.recent().toISOString(),
      status: faker.random.number({ min: 1, max: 5 }),
      progress: 100,
      duration: 10 * 60,
      finished: 1,
      ipAddress: faker.internet.ip(),
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
    };
    if (groupId) {
      fields.groupId = groupId;
    }
    this.verifyFabricatedData(SurveyResponse, fields);
    return fields;
  }

  createSurvey(): Promise<Survey> {
    const survey = this.entityMgr.create(Survey, this.fabricateSurvey());
    return this.entityMgr.save(survey);
  }

  async create(options: SurveyFabricatorOptions): Promise<void> {
    for (let s = 0; s < options.numSurveys; s++) {
      const survey = await this.entityMgr.save(
        this.entityMgr.create(Survey, this.fabricateSurvey())
      );

      for (let r = 0; r < options.numResponsesPerSurvey; r++) {
        await this.entityMgr.save(
          this.entityMgr.create(
            SurveyResponse,
            this.fabricateSurveyResponse(survey.id)
          )
        );
      }
    }
  }
}
