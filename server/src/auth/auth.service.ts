import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { validatePassword } from "./crypto";
import { AccessTokenPayload, LoginCredentials } from "./entities";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async login(loginCredentials: LoginCredentials) {
    const user = await this.userService.findUserByEmail(loginCredentials.email);

    if (user) {
      const validPassword = await validatePassword(
        loginCredentials.plainTextPassword,
        user.hashedPassword
      );

      if (validPassword) {
        const payload: AccessTokenPayload = {
          sub: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roles: user.roles
        };
        const token = this.jwtService.sign(payload);

        return {
          accessToken: token
        };
      }
    }

    throw new UnauthorizedException();
  }
}
