import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Letter } from "./letter";
import { LetterElementType } from "./letter-element-type";
import { SurveyDimension } from "../../survey/entities";
import { DEFAULT_QUILL_DELTA } from "../letter.types";
import { Image } from "../../image/entities";

@Entity()
@ObjectType()
export class LetterElement extends AbstractEntity {
  @Field(type => Int)
  @Column("int")
  sequence: number;

  @Column({ type: "text", default: DEFAULT_QUILL_DELTA })
  @Field({ nullable: true })
  textDelta?: string;

  @Column("int", { nullable: true }) imageId?: number;
  @Field(type => Image, { nullable: true })
  @OneToOne(type => Image, { nullable: true })
  @JoinColumn()
  image?: Image;

  @Column("int")
  letterId: number;
  @ManyToOne(type => Letter, letter => letter.letterElements)
  @Field(type => Letter)
  letter: Letter;

  @Column("int") letterElementTypeId: number;
  @ManyToOne(type => LetterElementType)
  @Field(type => LetterElementType)
  letterElementType: LetterElementType;

  @Column({ type: "int", nullable: true }) surveyDimensionId: number;
  @ManyToOne(type => SurveyDimension, { nullable: true })
  @Field(type => SurveyDimension, { nullable: true })
  surveyDimension?: SurveyDimension;
}

@InputType()
export class LetterElementCreateInput {
  @Field(type => Int) sequence: number;
  @Field({ nullable: true }) textDelta?: string;
  @Field(type => Int, { nullable: true }) imageId?: number;
  @Field(type => Int) letterId: number;
  @Field(type => Int) letterElementTypeId: number;
  @Field(type => Int, { nullable: true }) surveyDimensionId?: number;
}

@InputType()
export class LetterElementUpdateInput {
  @Field(type => Int) id: number;
  @Field(type => Int, { nullable: true }) sequence?: number;
  @Field({ nullable: true }) textDelta?: string;
  @Field(type => Int, { nullable: true }) imageId?: number;
  @Field(type => Int, { nullable: true }) letterElementTypeId?: number;
  @Field(type => Int, { nullable: true }) surveyDimensionId?: number;
}
