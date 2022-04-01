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
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("user");

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
    return this.repo.findOneBy({ id });
  }

  readAll() {
    return this.repo.find();
  }
}

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

  private alwaysRelate = {
    roles: true,
  };

  readOne(id: number) {
    debug("UserService.readOne(%d)", id);
    return this.repo.findOne({
      where: { id },
      relations: this.alwaysRelate,
    });
  }

  readAll() {
    return this.repo.find({ relations: this.alwaysRelate });
  }

  findUserByEmail(email: string) {
    return this.repo.findOne({
      where: { email },
      relations: this.alwaysRelate,
    });
  }

  update(updateInput: UserUpdateInput) {
    debug("UserService.update/%O", updateInput);
    return this.repo
      .preload(updateInput)
      .then((result) => this.repo.save(result));
  }

  async changePassword(passwordInput: ChangePasswordInput) {
    debug("UserService.changePassword %O", passwordInput);

    const user = await this.readOne(passwordInput.userId);
    debug("CURRENT USER %O", user);

    const validPassword = await validatePassword(
      passwordInput.currentPassword,
      user.password
    );

    if (validPassword) {
      debug("PASSWORD VALID '%s'", passwordInput.currentPassword);
      user.password = passwordInput.newPassword;
      const updatedUser = await this.repo.save(user);
      debug("UPDATED USER %O", updatedUser);
      return "Password changed successfully";
    } else {
      return "Invalid credentials; please try again";
    }
  }
}
