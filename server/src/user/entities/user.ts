import { AbstractEntity } from "../../shared/abstract-entity";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { UserRole } from "./user-role";

@Entity()
@ObjectType()
export class User extends AbstractEntity {
  @Field() @Column({ unique: true }) email: string;
  @Field() @Column() firstName: string;
  @Field() @Column() lastName: string;
  @Field() @Column() hashedPassword: string;

  @Field(returns => [UserRole])
  @ManyToMany(type => UserRole)
  @JoinTable()
  roles: UserRole[];
}

@InputType()
export class UserCreateInput {
  @Field() email: string;
  @Field() firstName: string;
  @Field() lastName: string;
  @Field() plainTextPassword: string;
  @Field(type => [Int]) userRoleIds: number[];
}
