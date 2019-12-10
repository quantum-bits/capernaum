import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "../auth/auth.service";
import { LoginCredentials, LoginResponse } from "./entities";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(returns => LoginResponse)
  login(@Args("loginCredentials") loginCredentials: LoginCredentials) {
    return this.authService.login(loginCredentials);
  }
}
