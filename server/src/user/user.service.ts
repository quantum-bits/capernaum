import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";

export interface User {
  id: number;
  email: string;
  hashedPassword: string;
  roles: string[];
}

export const ROLE_SYS_ADMIN = "sys-admin";
export const ROLE_SURVEY_ADMIN = "survey-admin";

const TEST_HASHED_PASSWORD =
  "$2b$10$.8jKztznXlJ6j83P8ahAOu4ZK5onQZ2zODhJr6v2kldZRJw8Djfmi";

@Injectable()
export class UserService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        id: 1,
        email: "tnurkkala@cse.taylor.edu",
        hashedPassword: TEST_HASHED_PASSWORD,
        roles: [ROLE_SYS_ADMIN]
      },
      {
        id: 2,
        email: "knkiers@taylor.edu",
        hashedPassword: TEST_HASHED_PASSWORD,
        roles: [ROLE_SYS_ADMIN]
      },
      {
        id: 3,
        email: "stbird@taylor.edu",
        hashedPassword: TEST_HASHED_PASSWORD,
        roles: [ROLE_SURVEY_ADMIN]
      }
    ];
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }
}
