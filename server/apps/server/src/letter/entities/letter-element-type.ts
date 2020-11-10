import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { LetterType } from "./letter-type";

@Entity()
@ObjectType()
export class LetterElementType extends AbstractEntity {
  @Field()
  @Column()
  key: string;

  @Field()
  @Column()
  description: string;

  // @Field((returns) => [LetterType])
  // @ManyToMany((type) => LetterType, (lType) => lType.letterElementTypes)
  // @JoinTable()
  // letterTypes: LetterType[];
}
