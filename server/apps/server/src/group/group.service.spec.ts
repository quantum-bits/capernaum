import { Test, TestingModule } from "@nestjs/testing";
import { GroupService } from "./group.service";
import { EntityManager, Repository } from "typeorm";
import { Group, GroupCreateInput } from "@server/src/group/entities";
import { Survey, SurveyCreateInput } from "@server/src/survey/entities";
import { GroupModule } from "./group.module";
import { SurveyModule } from "@server/src/survey/survey.module";
import { SurveyService } from "@server/src/survey/survey.service";
import { FabricatorModule } from "@server/src/fabricator/fabricator.module";
import { MultiTimer } from "@server/src/fabricator/MultiTimer";

const mt = new MultiTimer();

describe("GroupService", () => {
  let entityMgr: EntityManager;
  let groupService: GroupService;
  let surveyService: SurveyService;

  beforeAll(async () => {
    mt.record("beforeAll");
    const module: TestingModule = await Test.createTestingModule({
      imports: [FabricatorModule, GroupModule, SurveyModule],
    }).compile();

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
    const fakeSurvey = SurveyCreateInput.fabricate();

    return surveyService
      .createSurvey(fakeSurvey)
      .then((newSurvey) => {
        const fakeGroup = GroupCreateInput.fabricate(newSurvey.id);
        return groupService.createGroup(fakeGroup);
      })
      .then((newGroup) => entityMgr.count(Group))
      .then((count) => expect(count).toEqual(1));
  });
});
