import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Letter } from "./letter";
import { LetterElementType } from "./letter-element-type";
import { SurveyDimension } from "../../survey/entities";
import QuillDelta from "./quill-delta";

@Entity()
@ObjectType()
export class LetterElement extends AbstractEntity {
  @Field(type => Int)
  @Column("int")
  sequence: number;

  @Column("text", { nullable: true })
  @Field(type => QuillDelta, { nullable: true })
  textDelta?: any;

  @Column("integer") letterId: number;
  @ManyToOne(type => Letter, letter => letter.letterElements)
  @Field(type => Letter)
  letter: Letter;

  @Column("int") letterElementTypeId: number;
  @ManyToOne(type => LetterElementType)
  @Field(type => LetterElementType)
  letterElementType: LetterElementType;

  @Column("integer", { nullable: true }) surveyDimensionId: number;
  @ManyToOne(type => SurveyDimension)
  @Field(type => SurveyDimension, { nullable: true })
  surveyDimension?: SurveyDimension;
}

@InputType()
export class LetterElementCreateInput {
  @Field(type => Int) letterId: number;
  @Field(type => Int) sequence: number;
  @Field(type => Int) letterElementTypeId: number;
  @Field(type => QuillDelta, { nullable: true }) textDelta?: any;
  @Field(type => Int, { nullable: true }) surveyDimensionId?: number;
}

@InputType()
export class LetterElementUpdateInput {
  @Field(type => Int) id: number;
  @Field(type => Int, { nullable: true }) sequence?: number;
  @Field(type => Int, { nullable: true }) letterElementTypeId?: number;
  @Field(type => QuillDelta, { nullable: true }) textDelta?: any;
  @Field(type => Int, { nullable: true }) surveyDimensionId?: number;
}
