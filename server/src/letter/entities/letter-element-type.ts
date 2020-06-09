import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity } from "typeorm";
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
