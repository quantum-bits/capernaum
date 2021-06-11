import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  ChangePasswordInput,
  User,
  UserCreateInput,
  UserRole,
  UserRoleCreateInput,
  UserUpdateInput,
} from "./entities";
import { UserRoleService, UserService } from "./user.service";
import { Int } from "@nestjs/graphql";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";
import { UseGuards } from "@nestjs/common";

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args("createInput") createInput: UserCreateInput) {
    return this.userService.create(createInput);
  }

  @Query(() => User)
  user(@Args({ name: "id", type: () => Int }) id: number) {
    return this.userService.readOne(id);
  }

  @Query(() => [User])
  users() {
    return this.userService.readAll();
  }

  @Mutation(() => User)
  updateUser(@Args("updateInput") updateInput: UserUpdateInput) {
    return this.userService.update(updateInput);
  }

  @Mutation(() => String)
  async changePassword(
    @Args("passwordInput") passwordInput: ChangePasswordInput
  ) {
    return this.userService.changePassword(passwordInput);
  }
}

@Resolver(() => UserRole)
@UseGuards(GqlAuthGuard)
export class UserRoleResolver {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Mutation(() => UserRole)
  createUserRole(@Args("createInput") createInput: UserRoleCreateInput) {
    return this.userRoleService.create(createInput);
  }

  @Query(() => [UserRole])
  userRoles() {
    return this.userRoleService.readAll();
  }
}
