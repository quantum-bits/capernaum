import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Letter } from "./letter";
import { LetterElementType } from "./letter-element-type";
import { SurveyDimension } from "../../survey/entities";

@Entity()
@ObjectType()
export class LetterElement extends AbstractEntity {
  @Field(type => Int)
  @Column("int")
  sequence: number;

  @Column("text")
  @Field()
  content: string;

  @ManyToOne(type => Letter, letter => letter.elements)
  @Field(type => Letter)
  letter: Letter;

  @ManyToOne(type => LetterElementType)
  @Field(type => LetterElementType)
  letterElementType: LetterElementType;

  @ManyToOne(type => SurveyDimension)
  @Field(type => SurveyDimension)
  surveyDimension: SurveyDimension;
}
