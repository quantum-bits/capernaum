import { createUnionType, Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Letter } from "./letter";
import { LetterElementType } from "./letter-element-type";
import { SurveyDimension } from "../../survey/entities";

@ObjectType()
class QuillDeltaOp {
  @Field({ nullable: true }) insert?: string;
  @Field({ nullable: true }) delete?: number;
  @Field({ nullable: true }) retain?: number;
}

@ObjectType()
class QuillDelta {
  @Field(type => [QuillDeltaOp], { nullable: true }) ops?: QuillDeltaOp[];
}

@Entity()
@ObjectType()
export class LetterElement extends AbstractEntity {
  @Field(type => Int)
  @Column("int")
  sequence: number;

  @Column("text", { nullable: true })
  @Field({ nullable: true })
  textDelta?: QuillDelta;

  @ManyToOne(type => Letter, letter => letter.letterElements)
  @Field(type => Letter)
  letter: Letter;

  @Column("int") letterElementTypeId: number;
  @ManyToOne(type => LetterElementType)
  @Field(type => LetterElementType)
  letterElementType: LetterElementType;

  @ManyToOne(type => SurveyDimension)
  @Field(type => SurveyDimension)
  surveyDimension: SurveyDimension;
}
