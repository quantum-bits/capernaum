import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";

@Entity()
@ObjectType()
export class LetterElementType extends AbstractEntity {
  @Field()
  @Column()
  key: string;

  @Field()
  @Column()
  description: string;
}
