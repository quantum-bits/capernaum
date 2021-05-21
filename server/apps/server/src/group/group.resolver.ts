import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
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

@Resolver("Group")
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

@Resolver("GroupType")
export class GroupTypeResolver {
  constructor(private readonly grouptypeService: GroupTypeService) {}

  @Query(() => [GroupType])
  readGroupTypes() {
    return this.grouptypeService.readGroupTypes();
  }
}
