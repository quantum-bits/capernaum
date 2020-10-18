import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToMany } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { LetterElementType } from "@server/src/letter/entities/letter-element-type";

@Entity()
@ObjectType()
export class LetterType extends AbstractEntity {
  @Field()
  @Column()
  key: string;

  @Field()
  @Column()
  description: string;

  @Field((returns) => [LetterElementType])
  @ManyToMany(
    (type) => LetterElementType,
    (letterElementType) => letterElementType.letterTypes
  )
  letterElementTypes: LetterElementType[];
}
