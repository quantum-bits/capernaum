import { Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
import { EntityManager, Repository } from "typeorm";
import { User, UserCreateInput, UserRole } from "./entities";
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

    const roles: UserRole[] = [];
    for (const id of createInput.userRoleIds) {
      roles.push(await this.userRoleRepo.findOneOrFail(id));
    }

    return this.userRepo.save(
      this.userRepo.create({
        email: createInput.email,
        firstName: createInput.firstName,
        lastName: createInput.lastName,
        hashedPassword,
        roles
      })
    );
  }

  createUserRole(name: string) {
    return this.userRoleRepo.save(this.userRoleRepo.create({ name }));
  }

  allUsers() {
    return this.userRepo.find({ relations: ["roles"] });
  }

  findUserByEmail(email: string) {
    return this.userRepo.findOne({ email });
  }
}
