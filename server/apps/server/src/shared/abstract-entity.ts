import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@Entity()
@ObjectType()
export abstract class AbstractEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int, {
    description: "Unique ID for this entity",
  })
  id: number;
}
