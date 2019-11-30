import { AbstractEntity } from "../../shared/abstract-entity";
import { Field, ObjectType } from "type-graphql";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity()
@ObjectType()
export class UserRole extends AbstractEntity {
  @Field() @Column({ unique: true }) name: string;
}
