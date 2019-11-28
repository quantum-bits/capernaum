import { Injectable } from "@nestjs/common";

export type User = any;

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        userId: 1,
        username: "tnurkkala@cse.taylor.edu",
        password: "password"
      },
      {
        userId: 2,
        username: "knkiers@taylor.edu",
        password: "password"
      },
      {
        userId: 3,
        username: "steve_bird@taylor.edu",
        password: "password"
      }
    ];
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
