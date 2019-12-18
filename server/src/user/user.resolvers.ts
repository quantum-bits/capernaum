import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  ChangePasswordInput,
  User,
  UserCreateInput,
  UserRole,
  UserRoleCreateInput,
  UserUpdateInput
} from "./entities";
import { UserService } from "./user.service";
import { Int } from "type-graphql";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { validatePassword } from "../auth/crypto";

@Resolver(of => User)
// @UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(returns => User)
  createUser(@Args("createInput") createInput: UserCreateInput) {
    return this.userService.createUser(createInput);
  }

  @Query(returns => User)
  user(@Args({ name: "id", type: () => Int }) id: number) {
    return this.userService.oneUser(id);
  }

  @Query(returns => [User])
  users() {
    return this.userService.allUsers();
  }

  @Mutation(returns => User)
  updateUser(@Args("updateInput") updateInput: UserUpdateInput) {
    return this.userService.update(User, updateInput);
  }

  @Mutation(returns => String)
  async changePassword(
    @Args("passwordInput") passwordInput: ChangePasswordInput
  ) {
    const user = await this.userService.oneUser(passwordInput.userId);

    const validPassword = await validatePassword(
      passwordInput.currentPassword,
      user.password
    );

    if (validPassword) {
      return this.userService
        .update(User, {
          id: passwordInput.userId,
          password: passwordInput.newPassword
        })
        .then(() => "Password changed")
        .catch(err => `Something went wrong: ${err}`);
    } else {
      return "Invalid credentials; please try again";
    }
  }
}

@Resolver(of => UserRole)
export class UserRoleResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(returns => UserRole)
  createUserRole(@Args("createInput") createInput: UserRoleCreateInput) {
    return this.userService.createUserRole(createInput);
  }

  @Query(returns => [UserRole])
  userRoles() {
    return this.userService.find(UserRole);
  }
}
