import { Injectable } from "@nestjs/common";
import faker from "faker";
import { AbstractFabricatorService } from "./abstract-fabricator.service";
import { CodeWord } from "@server/src/group/entities";
import {
  Survey,
  SurveyCreateInput,
  SurveyResponse,
} from "@server/src/survey/entities";

@Injectable()
export class SurveyFabricatorService extends AbstractFabricatorService {
  fabricateSurvey(): SurveyCreateInput {
    return this.verifyFabricatedData(Survey, {
      qualtricsId: `QID-${faker.random.number({ min: 100000, max: 999999 })}`,
      qualtricsName: faker.lorem.word(2),
      qualtricsModDate: faker.date.past(1).toISOString(),
      emailKey: "EMAIL",
      groupCodeKey: "GROUP_CODE",
      okayForGroup: true,
      publicName: `Survey ${faker.lorem.word(3)}`,
      detailedDescription: faker.lorem.paragraph(),
    });
  }

  fabricateSurveyResponse(): SurveyResponse {
    return this.verifyFabricatedData(SurveyResponse, {
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
    });
  }

  createSurvey(): Promise<Survey> {
    const survey = this.entityMgr.create(Survey, this.fabricateSurvey());
    return this.entityMgr.save(survey);
  }
}
