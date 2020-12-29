import { Test, TestingModule } from "@nestjs/testing";
import { GroupService } from "./group.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Event } from "@server/src/events/entities";
import { Group, GroupCreateInput } from "@server/src/group/entities";
import { Image } from "@server/src/image/entities";
import {
  Letter,
  LetterElement,
  LetterElementType,
  LetterType,
} from "@server/src/letter/entities";
import { Machine } from "@server/src/machine/entities";
import {
  PredictionTableEntry,
  ScriptureEngagementPractice,
} from "@server/src/prediction/entities";
import {
  Survey,
  SurveyCreateInput,
  SurveyDimension,
  SurveyIndex,
  SurveyItem,
  SurveyItemResponse,
  SurveyResponse,
} from "@server/src/survey/entities";
import { User, UserRole } from "@server/src/user/entities";
import { GroupModule } from "./group.module";
import faker from "faker";
import { SurveyModule } from "@server/src/survey/survey.module";
import { SurveyService } from "@server/src/survey/survey.service";

describe("GroupService", () => {
  let entityMgr: EntityManager;
  let groupService: GroupService;
  let surveyService: SurveyService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GroupModule,
        SurveyModule,
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          synchronize: true,
          logging: false,
          entities: [
            Event,
            Group,
            Image,
            Letter,
            LetterType,
            LetterElement,
            LetterElementType,
            Machine,
            PredictionTableEntry,
            ScriptureEngagementPractice,
            Survey,
            SurveyDimension,
            SurveyIndex,
            SurveyItem,
            SurveyItemResponse,
            SurveyResponse,
            User,
            UserRole,
          ],
        }),
      ],
    }).compile();

    groupService = module.get<GroupService>(GroupService);
    surveyService = module.get<SurveyService>(SurveyService);
    entityMgr = module.get<EntityManager>(EntityManager);
  });

  beforeEach(() => {
    return Promise.all([entityMgr.clear(Group), entityMgr.clear(Survey)]);
  });

  it("should be defined", () => {
    expect(groupService).toBeDefined();
  });

  it("can create a group", () => {
    const fabricateSurvey = (): SurveyCreateInput => ({
      detailedDescription: faker.lorem.paragraph(),
      emailKey: "EMAIL",
      groupCodeKey: "GROUP1",
      okForGroup: true,
      publicName: `Survey ${faker.lorem.word(3)}`,
      qualtricsId: "Q123",
      qualtricsModDate: "2020-02-20",
      qualtricsName: faker.lorem.word(2),
      surveyItems: [],
    });

    const fabricateGroup = (surveyId: number): GroupCreateInput => {
      return {
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
        codeWord: "FIZZY",
        surveyId: surveyId,
      };
    };

    return surveyService
      .createSurvey(fabricateSurvey())
      .then((newSurvey) =>
        groupService.createGroup(fabricateGroup(newSurvey.id))
      )
      .then((newGroup) => entityMgr.count(Group))
      .then((count) => expect(count).toEqual(1));
  });
});
