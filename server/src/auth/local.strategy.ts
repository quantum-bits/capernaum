import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: "email"
    });
  }

  async validate(email: string, plainTextPassword: string) {
    const user = await this.authService.validateUser(email, plainTextPassword);
    console.log("VALIDATE", user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
