import { Field, ObjectType } from "@nestjs/graphql";
import { Entity, ManyToMany } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { LetterType } from "./letter-type";
import { FieldColumn } from "@server/src/decorators";

@Entity()
@ObjectType()
export class LetterElementType extends AbstractEntity {
  @FieldColumn("Letter element type name")
  key: string;

  @FieldColumn("Letter element type description")
  description: string;

  @Field(() => [LetterType])
  @ManyToMany(() => LetterType, (letterType) => letterType.letterElementTypes)
  letterTypes: LetterType[];
}
