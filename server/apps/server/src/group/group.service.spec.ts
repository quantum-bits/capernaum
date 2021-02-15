import { Test, TestingModule } from "@nestjs/testing";
import { GroupService } from "./group.service";
import { EntityManager, QueryFailedError } from "typeorm";
import { Group } from "@server/src/group/entities";
import { Survey, SurveyResponse } from "@server/src/survey/entities";
import { FabricatorModule } from "@server/src/fabricator/fabricator.module";
import { GroupFabricatorService } from "@server/src/fabricator/group-fabricator.service";
import { SurveyFabricatorService } from "@server/src/fabricator/survey-fabricator.service";
import Chance from "chance";
import _ from "lodash";

const chance = new Chance();

describe("GroupService", () => {
  let entityMgr: EntityManager;
  let groupService: GroupService;
  let groupFabricatorService: GroupFabricatorService;
  let surveyFabricatorService: SurveyFabricatorService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FabricatorModule],
    }).compile();

    entityMgr = module.get(EntityManager); // Import of TypeOrmModule
    groupService = module.get(GroupService); // Import of GroupModule
    groupFabricatorService = module.get(GroupFabricatorService); // Provider from FabricatorModule
    surveyFabricatorService = module.get(SurveyFabricatorService); // Provider from FabricatorModule
  });

  beforeEach(() => {
    return Promise.all([entityMgr.clear(Group), entityMgr.clear(Survey)]);
  });

  it("should be defined", () => {
    expect(groupService).toBeDefined();
  });

  it("can fetch all groups", async () => {
    const howMany = chance.natural({ min: 2, max: 8 });
    await groupFabricatorService.dbCreate(howMany);

    return groupService
      .readGroups()
      .then((groups) => expect(groups).toHaveLength(howMany));
  });

  it("can create a group with a related survey", async () => {
    const groupData = groupFabricatorService.fabricateGroup();
    const survey = await surveyFabricatorService.dbCreateSurvey();
    groupData.surveyId = survey.id;

    return groupService
      .createGroup(groupData)
      .then((group) => expect(groupData.name).toBe(group.name));
  });

  it("can't create a group without a survey", async () => {
    const groupData = groupFabricatorService.fabricateGroup();

    return expect(groupService.createGroup(groupData)).rejects.toThrowError(
      QueryFailedError
    );
  });

  it("can fetch one group", async () => {
    const howMany = chance.natural({ min: 2, max: 8 });
    const groups = await groupFabricatorService.dbCreate(howMany);
    const targetGroup = chance.pickone(groups);

    return groupService.readGroup(targetGroup.id).then((group) => {
      expect(group.name).toBe(targetGroup.name);
      expect(group.survey.id).toBe(targetGroup.surveyId);
      expect(group.survey.qualtricsName).toBe(targetGroup.survey.qualtricsName);
    });
  });

  it("can fetch all responses for a group", async () => {
    const fixture = await groupFabricatorService.prepareGroupWithSurveysFixture();
    const numResponses = fixture.surveyResponses.length;

    return groupService.readGroup(fixture.group.id).then((g) => {
      expect(g.survey.qualtricsName).toEqual(
        fixture.group.survey.qualtricsName
      );
      expect(g.surveyResponses).toHaveLength(numResponses);
      _.every(
        _.times(numResponses, (idx) =>
          expect(g.surveyResponses[idx].email).toEqual(
            fixture.surveyResponses[idx].email
          )
        )
      );
    });
  });
});
