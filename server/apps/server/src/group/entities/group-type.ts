import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Group } from "@server/src/group/entities/group";
import { FieldColumn } from "@server/src/decorators";

@Entity()
@ObjectType()
export class GroupType {
  @Field(() => Int) @PrimaryGeneratedColumn() id: number;

  @FieldColumn("Group name (e.g., 'Small Group')")
  name: string;

  @FieldColumn("Group code (e.g., 'small-group')")
  code: string;

  @Field(() => Int, { description: "Sequence number" })
  @Column({ default: -1 })
  seq: number;

  @Field(() => [Group])
  @OneToMany(() => Group, (group) => group.type)
  groups: Group[];
}
