import { Injectable } from "@nestjs/common";
import { User, UserService } from "../user/user.service";
import { compare, hash } from "bcrypt";
import { JwtService } from "@nestjs/jwt";

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  static hashPassword(plainTextPassword: string) {
    return hash(plainTextPassword, SALT_ROUNDS);
  }

  static validatePassword(
    plainTextPassword: string,
    encryptedPassword: string
  ) {
    return compare(plainTextPassword, encryptedPassword);
  }

  async validateUser(email: string, plainTextPassword: string) {
    console.log("PWD", await AuthService.hashPassword(plainTextPassword));
    const user = await this.userService.findOne(email);
    console.log("USER", user);
    if (user) {
      if (
        await AuthService.validatePassword(
          plainTextPassword,
          user.hashedPassword
        )
      ) {
        // Return everything but the password.
        const { hashedPassword, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: this.jwtService.sign(payload)
    };
  }
}
