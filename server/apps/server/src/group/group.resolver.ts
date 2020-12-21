import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "@server/src/auth/graphql-auth.guard";
import { GroupService } from "@server/src/group/group.service";
import {
  Group,
  GroupCreateInput,
  GroupUpdateInput,
} from "@server/src/group/entities/group";
import { SurveyResponse } from "@server/src/survey/entities";

@Resolver("Group")
@UseGuards(GqlAuthGuard)
export class GroupResolver {
  constructor(private readonly groupService: GroupService) {}

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
}
