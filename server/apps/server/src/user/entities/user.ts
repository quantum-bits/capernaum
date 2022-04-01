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
import { getDebugger } from "@helpers/debug-factory";
import { FieldColumn } from "@server/src/decorators";

const debug = getDebugger("user");

@Entity()
@ObjectType()
export class User extends AbstractEntity {
  @FieldColumn("Email address", { unique: true })
  email: string;

  @FieldColumn("First name")
  firstName: string;

  @FieldColumn("Last name")
  lastName: string;

  @Column({ comment: "Encrypted password" })
  password: string; // Don't expose this via GraphQL.

  @BeforeInsert()
  @BeforeUpdate()
  private async encryptPassword() {
    const savedPassword = this.password;
    this.password = await hashPassword(this.password);
    debug("ENCRYPT '%s' => '%s'", savedPassword, this.password);
  }

  @Field(() => [UserRole])
  @ManyToMany(() => UserRole)
  @JoinTable()
  roles: UserRole[];
}

@InputType()
export class UserCreateInput {
  @Field() email: string;
  @Field() firstName: string;
  @Field() lastName: string;
  @Field() password: string;
  @Field(() => [Int]) userRoleIds: number[];
}

@InputType()
export class UserUpdateInput {
  @Field(() => Int) id: number;
  @Field({ nullable: true }) email?: string;
  @Field({ nullable: true }) firstName?: string;
  @Field({ nullable: true }) lastName?: string;
  @Field(() => [Int], { nullable: true }) userRoleIds?: number[];
}

@InputType()
export class ChangePasswordInput {
  @Field(() => Int, { description: "ID of user changing password" })
  userId: number;

  @Field({ description: "Current (plaintext) password for validation" })
  currentPassword: string;

  @Field({ description: "New (plaintext) password to set" })
  newPassword: string;
}

// JWT payload.
@ObjectType()
export class UserPayload {
  @Field() id: number;
  @Field() firstName: string;
  @Field() lastName: string;
  @Field() email: string;
  @Field(() => [UserRole]) roles: UserRole[];
}
