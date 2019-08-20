import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class LetterElementType {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Field()
  @Column()
  key: string;

  @Field()
  @Column()
  description: string;
}
