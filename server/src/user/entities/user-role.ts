import { AbstractEntity } from "../../shared/abstract-entity";
import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, ManyToMany } from "typeorm";
import { User } from "./user";

@Entity()
@ObjectType()
export class UserRole extends AbstractEntity {
  @Field() @Column() name: string;
  @Field() @Column() description: string;

  @Field(returns => [User])
  @ManyToMany(type => User)
  users: User[];
}

@InputType()
export class UserRoleCreateInput {
  @Field() name: string;
}
