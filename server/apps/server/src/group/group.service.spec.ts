import { Test, TestingModule } from "@nestjs/testing";
import { GroupService } from "./group.service";
import { EntityManager } from "typeorm";
import { Group, GroupCreateInput } from "@server/src/group/entities";
import { Survey, SurveyResponse } from "@server/src/survey/entities";
import { GroupModule } from "./group.module";
import { SurveyModule } from "@server/src/survey/survey.module";
import { SurveyService } from "@server/src/survey/survey.service";
import { FabricatorModule } from "@server/src/fabricator/fabricator.module";
import { GroupFabricatorService } from "@server/src/fabricator/group-fabricator.service";
import { SurveyFabricatorService } from "@server/src/fabricator/survey-fabricator.service";
import * as faker from "faker";

describe("GroupService", () => {
  let entityMgr: EntityManager;
  let groupService: GroupService;
  let surveyService: SurveyService;
  let groupFabricatorService: GroupFabricatorService;
  let surveyFabricatorService: SurveyFabricatorService;

  beforeAll(async () => {
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
    return Promise.all([entityMgr.clear(Group), entityMgr.clear(Survey)]);
  });

  it("should be defined", () => {
    expect(groupService).toBeDefined();
  });

  it("can fetch all groups", async () => {
    const howMany = faker.random.number({ min: 2, max: 8 });
    await groupFabricatorService.create(howMany);

    return groupService
      .readGroups()
      .then((groups) => expect(groups).toHaveLength(howMany));
  });

  it("can create a group", async () => {
    const survey = await surveyFabricatorService.createSurvey();
    const groupData = groupFabricatorService.fabricateGroup(survey.id);

    return groupService
      .createGroup(groupData)
      .then((group) => expect(groupData.name).toBe(group.name));
  });

  it("can fetch one group", async () => {
    const howMany = faker.random.number({ min: 2, max: 8 });
    const groups = await groupFabricatorService.create(howMany);
    const targetGroup = faker.random.arrayElement(groups);

    return groupService.readGroup(targetGroup.id).then((group) => {
      expect(group.name).toBe(targetGroup.name);
      expect(group.survey.id).toBe(targetGroup.surveyId);
      expect(group.survey.qualtricsName).toBe(targetGroup.survey.qualtricsName);
    });
  });

  it.todo("can fetch all responses for a group");
});
