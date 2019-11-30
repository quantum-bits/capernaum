import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "../auth/auth.service";
import { User } from "../user/entities";
import { LoginCredentials } from "./entities";
import { UserService } from "../user/user.service";

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Mutation(returns => User)
  login(@Args("loginCredentials") loginCredentials: LoginCredentials) {
    console.log("CRED", loginCredentials);

    const user = this.userService.findUserByEmail(loginCredentials.email);
    return user;
  }
}
