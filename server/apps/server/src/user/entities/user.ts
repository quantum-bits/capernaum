import { AbstractEntity } from "../../shared/abstract-entity";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { UserRole } from "./user-role";
import { hashPassword } from "../../auth/crypto";
import Debug from "debug";
const debug = Debug("user");

@Entity()
@ObjectType()
export class User extends AbstractEntity {
  @Field() @Column({ unique: true }) email: string;
  @Field() @Column() firstName: string;
  @Field() @Column() lastName: string;

  @Column() password: string; // Don't expose this via GraphQL.
  private tempPassword: string;

  @AfterLoad()
  private loadTempPassword() {
    this.tempPassword = this.password;
    debug("AFTER LOAD '%s'", this.tempPassword);
  }

  @BeforeInsert()
  private async encryptOnAdd() {
    this.password = await hashPassword(this.password);
    debug("BEFORE INSERT %O", this);
  }

  @BeforeUpdate()
  private async encryptonUpdate() {
    debug("BEFORE UPDATE '%s', '%s'", this.tempPassword, this.password);
    if (this.tempPassword !== this.password) {
      this.password = await hashPassword(this.password);
      this.loadTempPassword();
    }
  }

  @Field((returns) => [UserRole])
  @ManyToMany((type) => UserRole)
  @JoinTable()
  roles: UserRole[];
}

@InputType()
export class UserCreateInput {
  @Field() email: string;
  @Field() firstName: string;
  @Field() lastName: string;
  @Field() password: string;
  @Field((type) => [Int]) userRoleIds: number[];
}

@InputType()
export class UserUpdateInput {
  @Field((type) => Int) id: number;
  @Field({ nullable: true }) email?: string;
  @Field({ nullable: true }) firstName?: string;
  @Field({ nullable: true }) lastName?: string;
  @Field((type) => [Int], { nullable: true }) userRoleIds?: number[];
}

@InputType()
export class ChangePasswordInput {
  @Field((type) => Int) userId: number;
  @Field() currentPassword: string;
  @Field() newPassword: string;
}

// JWT payload.
@ObjectType()
export class UserPayload {
  @Field() id: number;
  @Field() firstName: string;
  @Field() lastName: string;
  @Field() email: string;
  @Field((type) => [UserRole]) roles: UserRole[];
}
