import { Test, TestingModule } from "@nestjs/testing";
import { GroupService } from "./group.service";
import { EntityManager, Repository } from "typeorm";
import { Group, GroupCreateInput } from "@server/src/group/entities";
import {
  Survey,
  SurveyCreateInput,
  SurveyResponse,
} from "@server/src/survey/entities";
import { GroupModule } from "./group.module";
import { SurveyModule } from "@server/src/survey/survey.module";
import { SurveyService } from "@server/src/survey/survey.service";
import { FabricatorModule } from "@server/src/fabricator/fabricator.module";
import { MultiTimer } from "@server/src/helpers/MultiTimer";
import { Chance } from "chance";
import { GroupFabricatorService } from "@server/src/fabricator/group-fabricator.service";
import { SurveyFabricatorService } from "@server/src/fabricator/survey-fabricator.service";

const mt = new MultiTimer();
const chance = new Chance();

describe("GroupService", () => {
  let entityMgr: EntityManager;
  let groupService: GroupService;
  let surveyService: SurveyService;
  let groupFabricatorService: GroupFabricatorService;
  let surveyFabricatorService: SurveyFabricatorService;

  beforeAll(async () => {
    mt.record("beforeAll");
    const module: TestingModule = await Test.createTestingModule({
      imports: [FabricatorModule, GroupModule, SurveyModule],
    }).compile();

    groupFabricatorService = module.get<GroupFabricatorService>(
      GroupFabricatorService
    );
    surveyFabricatorService = module.get<SurveyFabricatorService>(
      SurveyFabricatorService
    );
    groupService = module.get<GroupService>(GroupService);
    surveyService = module.get<SurveyService>(SurveyService);
    entityMgr = module.get<EntityManager>(EntityManager);
  });

  beforeEach(() => {
    mt.record("beforeEach");
    return Promise.all([entityMgr.clear(Group), entityMgr.clear(Survey)]);
  });

  afterAll(() => {
    console.log(mt.report());
  });

  it("should be defined", () => {
    mt.record("Service defined");
    expect(groupService).toBeDefined();
  });

  it("can create a group", () => {
    mt.record("Create a group");
    return groupFabricatorService
      .create(12)
      .then((newGroup) => entityMgr.count(Group))
      .then((count) => expect(count).toEqual(1));
  });

  it.skip("can fetch all groups", async () => {
    const groupRepo = entityMgr.getRepository(Group);
    const surveyRepo = entityMgr.getRepository(Survey);

    const survey = await surveyRepo.save(
      surveyRepo.create(surveyFabricatorService.fabricateSurvey())
    );

    const howMany = chance.integer({ min: 1, max: 10 });
    for (let i = 0; i < howMany; i++) {
      const group = await groupRepo.save(
        groupRepo.create(groupFabricatorService.fabricateGroup(survey.id))
      );
    }
    return groupService
      .readGroups()
      .then((groups) => expect(groups.length).toEqual(howMany));
  });

  it.todo("can fetch one group");

  it.skip("can create a group survey and responses", async () => {
    const groupRepo = entityMgr.getRepository(Group);
    const surveyRepo = entityMgr.getRepository(Survey);
    const surveyResponseRepo = entityMgr.getRepository(SurveyResponse);

    const survey = await surveyRepo.save(
      surveyRepo.create(surveyFabricatorService.fabricateSurvey())
    );

    const group = await groupRepo.save(
      groupRepo.create(groupFabricatorService.fabricateGroup(survey.id))
    );

    for (let i = 0; i < 8; i++) {
      const response = await surveyResponseRepo.save(
        surveyResponseRepo.create(
          surveyFabricatorService.fabricateSurveyResponse(survey.id, group.id)
        )
      );
    }

    const groups = await groupService.readGroups();
    console.log(groups);
    expect(groups.length).toEqual(1);
  });
});
