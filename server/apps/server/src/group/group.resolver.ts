import {
  Args,
  Context,
  Info,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Root,
} from "@nestjs/graphql";
import {
  GroupService,
  GroupTypeService,
} from "@server/src/group/group.service";
import {
  Group,
  GroupCreateInput,
  GroupUpdateInput,
  GroupType,
} from "@server/src/group/entities";
import { SurveyService } from "@server/src/survey/survey.service";

import debug from "debug";
const groupDebug = debug("group");

@Resolver(() => Group)
export class GroupResolver {
  constructor(
    private readonly groupService: GroupService,
    private readonly groupTypeService: GroupTypeService,
    private readonly surveyService: SurveyService
  ) {}

  @Mutation(() => Group)
  createGroup(@Args("createInput") createInput: GroupCreateInput) {
    return this.groupService.createGroup(createInput);
  }

  @Query(() => [Group])
  readGroups() {
    return this.groupService.readGroups();
  }

  @Mutation(() => Group)
  updateGroup(@Args("updateInput") updateInput: GroupUpdateInput) {
    return this.groupService.updateGroup(updateInput);
  }

  @ResolveField()
  type(@Parent() group: Group) {
    groupDebug("type/parent %O", group);
    if (group.type) {
      groupDebug("Already have type");
      return group.type;
    } else {
      groupDebug("Must fetch type");
      return this.groupTypeService.readGroupType(group.typeId);
    }
  }

  @ResolveField()
  survey(@Parent() group: Group) {
    const { surveyId } = group;
    groupDebug("survey/resolving %d", surveyId);
    return this.surveyService.readSurvey(surveyId);
  }
}

@Resolver(() => GroupType)
export class GroupTypeResolver {
  constructor(private readonly groupTypeService: GroupTypeService) {}

  @Query(() => [GroupType])
  readGroupTypes() {
    return this.groupTypeService.readGroupTypes();
  }
}
