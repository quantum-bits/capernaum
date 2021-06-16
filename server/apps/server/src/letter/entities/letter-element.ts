import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Letter } from "./letter";
import { LetterElementType } from "./letter-element-type";
import { SurveyDimension } from "../../survey/entities";
import { DEFAULT_QUILL_DELTA } from "../letter.types";
import { Image } from "../../image/entities";
import { PredictionTable } from "@server/src/prediction/entities";
import { FieldColumn } from "@server/src/decorators";

@Entity()
@ObjectType()
export class LetterElement extends AbstractEntity {
  @Field(() => Letter)
  @ManyToOne(() => Letter, (letter) => letter.letterElements)
  letter: Letter;

  @Field(() => LetterElementType)
  @ManyToOne(() => LetterElementType)
  letterElementType: LetterElementType;

  @FieldColumn("sequence number", () => Int, { type: "integer" })
  sequence: number;

  @FieldColumn("Quill text delta", {
    type: "text",
    nullable: true,
    default: DEFAULT_QUILL_DELTA,
  })
  textDelta?: string;

  @Field(() => Image, { nullable: true })
  @OneToOne(() => Image, { nullable: true })
  @JoinColumn()
  image?: Image;

  @Field(() => SurveyDimension, { nullable: true })
  @ManyToOne(() => SurveyDimension, { nullable: true })
  surveyDimension?: SurveyDimension;

  @Field(() => PredictionTable, { nullable: true })
  @ManyToOne(
    () => PredictionTable,
    (predictionTable) => predictionTable.letterElements,
    { nullable: true }
  )
  predictionTable?: PredictionTable;
}

@InputType()
export class LetterElementCreateInput {
  @Field(() => Int) sequence: number;
  @Field({ nullable: true }) textDelta?: string;
  @Field(() => Int, { nullable: true }) imageId?: number;
  @Field(() => Int) letterId: number;
  @Field(() => Int) letterElementTypeId: number;
  @Field(() => Int, { nullable: true }) surveyDimensionId?: number;
}

@InputType()
export class LetterElementUpdateInput {
  @Field(() => Int) id: number;
  @Field(() => Int, { nullable: true }) sequence?: number;
  @Field({ nullable: true }) textDelta?: string;
  @Field(() => Int, { nullable: true }) imageId?: number;
  @Field(() => Int, { nullable: true }) letterElementTypeId?: number;
  @Field(() => Int, { nullable: true }) surveyDimensionId?: number;
}
