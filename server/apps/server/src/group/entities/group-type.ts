import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Group } from "@server/src/group/entities/group";

@Entity()
@ObjectType()
export class GroupType {
  @Field(() => Int) @PrimaryGeneratedColumn() id: number;

  @Field({ description: "Group name (e.g., 'Small Group')" })
  @Column()
  name: string;

  @Field({ description: "Group code (e.g., 'SMALL_GROUP')" })
  @Column()
  code: string;

  @Field(() => [Group])
  @OneToMany(() => Group, (group) => group.type)
  groups: Group[];
}
