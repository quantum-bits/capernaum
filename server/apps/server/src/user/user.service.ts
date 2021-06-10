import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import {
  ChangePasswordInput,
  User,
  UserCreateInput,
  UserRole,
  UserRoleCreateInput,
  UserUpdateInput,
} from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "@server/src/shared/base.service";
import { validatePassword } from "@server/src/auth/crypto";

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    private readonly userRoleService: UserRoleService,
    @InjectRepository(User) private readonly repo: Repository<User>
  ) {
    super(repo);
  }

  async create(createInput: UserCreateInput) {
    // Resolve role IDs to roles entities.
    const roles = await Promise.all(
      createInput.userRoleIds.map((roleId) =>
        this.userRoleService.readOne(roleId)
      )
    );

    return this.repo.save(
      this.repo.create({
        ...createInput,
        roles,
      })
    );
  }

  private alwaysResolve = ["roles"];

  readOne(id: number) {
    return this.repo.findOne(id, { relations: this.alwaysResolve });
  }

  readAll() {
    return this.repo.find({ relations: this.alwaysResolve });
  }

  findUserByEmail(email: string) {
    return this.repo.findOne({ email }, { relations: this.alwaysResolve });
  }

  update(updateInput: UserUpdateInput) {
    return this.repo
      .preload(updateInput)
      .then((result) => this.repo.save(result));
  }

  async changePassword(passwordInput: ChangePasswordInput) {
    const user = await this.readOne(passwordInput.userId);

    const validPassword = await validatePassword(
      passwordInput.currentPassword,
      user.password
    );

    if (validPassword) {
      return this.repo
        .update(passwordInput.userId, { password: passwordInput.newPassword })
        .then(() => "Password changed")
        .catch((err) => `Something went wrong: ${err}`);
    } else {
      return "Invalid credentials; please try again";
    }
  }
}

@Injectable()
export class UserRoleService extends BaseService<UserRole> {
  constructor(
    @InjectRepository(UserRole)
    private readonly repo: Repository<UserRole>
  ) {
    super(repo);
  }

  create(createInput: UserRoleCreateInput) {
    return this.repo.save(this.repo.create(createInput));
  }

  readOne(id: number) {
    return this.repo.findOne(id);
  }

  readAll() {
    return this.repo.find();
  }
}
