import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  User,
  UserCreateInput,
  UserRole,
  UserRoleCreateInput
} from "./entities";
import { UserService } from "./user.service";
import { Int } from "type-graphql";
import { AuthService } from "../auth/auth.service";

@Resolver(of => User)
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
