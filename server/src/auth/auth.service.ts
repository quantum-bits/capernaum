import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { User } from "../user/entities";

const SALT_ROUNDS = 10;

export function hashPassword(plainTextPassword: string) {
  return hash(plainTextPassword, SALT_ROUNDS);
}

function validatePassword(
  plainTextPassword: string,
  encryptedPassword: string
) {
  return compare(plainTextPassword, encryptedPassword);
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, plainTextPassword: string) {
    console.log("PWD", await hashPassword(plainTextPassword));
    const user = await this.userService.findUserByEmail(email);
    console.log("USER", user);
    if (user) {
      if (await validatePassword(plainTextPassword, user.hashedPassword)) {
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
      accessToken: this.jwtService.sign(payload)
    };
  }
}
