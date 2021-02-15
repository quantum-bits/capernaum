import { Test, TestingModule } from "@nestjs/testing";
import { GroupService } from "../group/group.service";
import { EntityManager, QueryFailedError } from "typeorm";
import { Group } from "@server/src/group/entities";
import { Survey, SurveyResponse } from "@server/src/survey/entities";
import { FabricatorModule } from "@server/src/fabricator/fabricator.module";
import { GroupFabricatorService } from "@server/src/fabricator/group-fabricator.service";
import { SurveyFabricatorService } from "@server/src/fabricator/survey-fabricator.service";
import { SurveyService } from "@server/src/survey/survey.service";

describe("GroupService", () => {
  let entityMgr: EntityManager;
  let surveyService: SurveyService;
  let groupFabricatorService: GroupFabricatorService;
  let surveyFabricatorService: SurveyFabricatorService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FabricatorModule],
    }).compile();

    entityMgr = module.get<EntityManager>(EntityManager); // Import of TypeOrmModule
    surveyService = module.get<SurveyService>(SurveyService); // Import of GroupModule
    groupFabricatorService = module.get<GroupFabricatorService>(
      GroupFabricatorService
    ); // Provider from FabricatorModule
    surveyFabricatorService = module.get<SurveyFabricatorService>(
      SurveyFabricatorService
    ); // Provider from FabricatorModule
  });

  beforeEach(() => {
    return Promise.all([entityMgr.clear(Group), entityMgr.clear(Survey)]);
  });

  it("should be defined", () => {
    expect(surveyService).toBeDefined();
  });

  it("can fetch responses for a group", async () => {
    const fixture = await groupFabricatorService.prepareGroupWithSurveysFixture();

    return surveyService
      .readSurveyResponses(fixture.group.id)
      .then((surveyResponses) => {
        expect(surveyResponses).toHaveLength(fixture.surveyResponses.length);
      });
  });

  it.todo("can fetch all surveys");
  it.todo("can fetch one survey");
});
