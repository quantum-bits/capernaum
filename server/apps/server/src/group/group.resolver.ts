import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
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
import { getDebugger } from "@helpers/debug-factory";

const groupDebug = getDebugger("group");

@Resolver(() => Group)
export class GroupResolver {
  constructor(
    private readonly groupService: GroupService,
    private readonly groupTypeService: GroupTypeService
  ) {}

  @Mutation(() => Group)
  createGroup(@Args("createInput") createInput: GroupCreateInput) {
    return this.groupService.createGroup(createInput);
  }

  @Query(() => [Group])
  readGroups() {
    return this.groupService.readGroups();
  }

  @Query(() => Group, { nullable: true })
  readGroup(@Args({ name: "id", type: () => Int }) id: number) {
    return this.groupService.readGroup(id);
  }

  @Query(() => Group, { nullable: true })
  findGroupByCodeWord(@Args("codeWord") codeWord: string) {
    return this.groupService.findGroupByCodeWord(codeWord);
  }

  @Mutation(() => Group)
  updateGroup(@Args("updateInput") updateInput: GroupUpdateInput) {
    return this.groupService.updateGroup(updateInput);
  }

  @Mutation(() => Int)
  deleteGroup(
    @Args({ name: "id", type: () => Int }) id: number
  ): Promise<number> {
    return this.groupService.deleteGroup(id).then((result) => result.affected);
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
}

@Resolver(() => GroupType)
export class GroupTypeResolver {
  constructor(private readonly groupTypeService: GroupTypeService) {}

  @Query(() => [GroupType])
  readGroupTypes() {
    return this.groupTypeService.readGroupTypes();
  }
}
