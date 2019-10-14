import {
  createUnionType,
  Field,
  InputType,
  Int,
  ObjectType
} from "type-graphql";
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

  @Column("integer") letterId: number;
  @ManyToOne(type => Letter, letter => letter.letterElements)
  @Field(type => Letter)
  letter: Letter;

  @Column("int") letterElementTypeId: number;
  @ManyToOne(type => LetterElementType)
  @Field(type => LetterElementType)
  letterElementType: LetterElementType;

  @Column("integer") surveyDimensionId: number;
  @ManyToOne(type => SurveyDimension)
  @Field(type => SurveyDimension)
  surveyDimension: SurveyDimension;
}

// It's stinky that we appear to have to duplicate these declarations as GraphQL `input`.
@InputType()
class QuillDeltaOpInput {
  @Field({ nullable: true }) insert?: string;
  @Field({ nullable: true }) delete?: number;
  @Field({ nullable: true }) retain?: number;
}

@InputType()
class QuillDeltaInput {
  @Field(type => [QuillDeltaOpInput], { nullable: true }) ops?: QuillDeltaOp[];
}

@InputType()
export class LetterElementCreateInput {
  @Field(type => Int) sequence: number;
  @Field(type => QuillDeltaInput, { nullable: true }) textDelta?: QuillDelta;
  @Field(type => Int) letterId: number;
  @Field(type => Int) letterElementTypeId: number;
  @Field(type => Int) surveyDimensionId: number;
}

@InputType()
export class LetterElementUpdateInput {
  @Field(type => Int) id: number;
  @Field(type => Int, { nullable: true }) sequence?: number;
  @Field(type => QuillDeltaInput, { nullable: true }) textDelta?: QuillDelta;
  @Field(type => Int, { nullable: true }) letterId?: number;
  @Field(type => Int, { nullable: true }) letterElementTypeId?: number;
  @Field(type => Int, { nullable: true }) surveyDimensionId?: number;
}
