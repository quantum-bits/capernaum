import { Entity, OneToMany } from "typeorm";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { FieldColumn } from "@server/src/decorators";
import { AbstractEntity } from "@server/src/shared/abstract-entity";
import { Group } from "./group";

@Entity()
@ObjectType()
export class GroupType extends AbstractEntity {
  @FieldColumn("Group name (e.g., 'Small Group')")
  name: string;

  @FieldColumn("Group code (e.g., 'small-group')")
  code: string;

  @FieldColumn("Sequence number", () => Int, { default: -1 })
  seq: number;

  @Field(() => [Group])
  @OneToMany(() => Group, (group) => group.type)
  groups: Group[];
}
