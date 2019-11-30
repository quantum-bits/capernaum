import { Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
import { EntityManager, Repository } from "typeorm";
import {
  User,
  UserCreateInput,
  UserRole,
  UserRoleCreateInput
} from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { hashPassword } from "../auth/auth.service";

@Injectable()
export class UserService extends BaseService {
  constructor(
    protected readonly entityManager: EntityManager,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>
  ) {
    super(entityManager);
  }

  async createUser(createInput: UserCreateInput) {
    const hashedPassword = await hashPassword(createInput.plainTextPassword);
    return this.userRepo.save(
      this.userRepo.create({
        email: createInput.email,
        firstName: createInput.firstName,
        lastName: createInput.lastName,
        hashedPassword
      })
    );
  }

  createUserRole(createInput: UserRoleCreateInput) {
    return this.userRoleRepo.save(this.userRoleRepo.create(createInput));
  }

  findUserByEmail(email: string) {
    return this.userRepo.findOne({ email });
  }
}
