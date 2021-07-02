import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { LetterElementType } from "./letter-element-type";
import { FieldColumn } from "@server/src/decorators";
import { SurveyLetter } from "@server/src/survey/entities";

@Entity()
@ObjectType()
export class LetterType extends AbstractEntity {
  @FieldColumn("Letter type name")
  key: string;

  @FieldColumn("Letter type description")
  description: string;

  @Field(() => [SurveyLetter], {
    description: "Survey letters for this letter type",
  })
  @OneToMany(() => SurveyLetter, (surveyLetter) => surveyLetter.letterType)
  surveyLetters: SurveyLetter[];

  @Field(() => [LetterElementType])
  @ManyToMany(
    () => LetterElementType,
    (letterElementType) => letterElementType.letterTypes
  )
  @JoinTable({ name: "letter_type_letter_element_type" })
  letterElementTypes: LetterElementType[];
}

@InputType()
export class LetterTypeCreateInput {
  @Field({ description: "Human readable key" })
  key: string;
  @Field({ description: "Description of this type" })
  description: string;
}

@InputType()
export class LetterTypeUpdateInput {
  @Field(() => Int)
  id: number;
  @Field({ description: "Human readable key", nullable: true })
  key?: string;
  @Field({ description: "Description of this type", nullable: true })
  description?: string;
}
