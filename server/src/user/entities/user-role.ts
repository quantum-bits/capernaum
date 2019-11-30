import { AbstractEntity } from "../../shared/abstract-entity";
import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity()
@ObjectType()
export class UserRole extends AbstractEntity {
  @Field() @Column({ unique: true }) name: string;
  @Field() @Column() description: string;
}

@InputType()
export class UserRoleCreateInput {
  @Field() name: string;
  @Field() description: string;
}
