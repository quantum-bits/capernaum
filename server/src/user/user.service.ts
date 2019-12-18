import { Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
import { EntityManager, Repository } from "typeorm";
import {
  User,
  UserCreateInput,
  UserRole,
  UserRoleCreateInput,
  UserUpdateInput
} from "./entities";
import { InjectRepository } from "@nestjs/typeorm";

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
    // Resolve role IDs to roles objects.
    const roles: UserRole[] = [];
    for (const id of createInput.userRoleIds) {
      roles.push(await this.userRoleRepo.findOneOrFail(id));
    }

    // Create and save the user. Because this is the only modification to the database,
    // don't bother with a transaction.
    return this.userRepo.save(this.userRepo.create(createInput));
  }

  createUserRole(createInput: UserRoleCreateInput) {
    return this.userRoleRepo.save(this.userRoleRepo.create(createInput));
  }

  oneUser(id: number) {
    return this.userRepo.findOne(id, { relations: ["roles"] });
  }

  allUsers() {
    return this.userRepo.find({ relations: ["roles"] });
  }

  findUserByEmail(email: string) {
    return this.userRepo.findOne({ email }, { relations: ["roles"] });
  }
}
