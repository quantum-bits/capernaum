import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { validatePassword } from "./crypto";
import { LoginCredentials } from "./entities";
import { UserPayload } from "../user/entities";

interface LoginConfirmation {
  user: UserPayload;
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async login(loginCredentials: LoginCredentials): Promise<LoginConfirmation> {
    const user = await this.userService.findUserByEmail(loginCredentials.email);

    if (user) {
      const validPassword = await validatePassword(
        loginCredentials.password,
        user.password
      );

      if (validPassword) {
        const userPayload: UserPayload = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roles: user.roles,
        };
        const token = this.jwtService.sign(userPayload);

        return {
          user: userPayload,
          accessToken: token,
        };
      }
    }

    throw new UnauthorizedException();
  }
}
