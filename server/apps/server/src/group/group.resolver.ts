import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
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

@Resolver(() => Group)
export class GroupResolver {
  constructor(
    private readonly groupService: GroupService,
    private readonly groupTypeService: GroupTypeService
  ) {}

  @Mutation(() => Group)
  createGroup(@Args("createInput") createInput: GroupCreateInput) {
    return this.groupService.create(createInput);
  }

  @Query(() => [Group])
  readGroups() {
    return this.groupService.readAll();
  }

  @Query(() => Group, { nullable: true })
  readGroup(@Args({ name: "id", type: () => Int }) id: number) {
    return this.groupService.readOne(id);
  }

  @Query(() => Group, { nullable: true })
  findGroupByCodeWord(@Args("codeWord") codeWord: string) {
    return this.groupService.findByCodeWord(codeWord);
  }

  @Mutation(() => Group)
  updateGroup(@Args("updateInput") updateInput: GroupUpdateInput) {
    return this.groupService.update(updateInput);
  }

  @Mutation(() => Int)
  deleteGroup(
    @Args({ name: "id", type: () => Int }) id: number
  ): Promise<number> {
    return this.groupService.delete(id).then((result) => result.affected);
  }
}

@Resolver(() => GroupType)
export class GroupTypeResolver {
  constructor(private readonly groupTypeService: GroupTypeService) {}

  @Query(() => [GroupType])
  readGroupTypes() {
    return this.groupTypeService.readAll();
  }
}
