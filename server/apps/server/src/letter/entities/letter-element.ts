import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Letter } from "./letter";
import { LetterElementType } from "./letter-element-type";
import { SurveyDimension } from "../../survey/entities";
import { DEFAULT_QUILL_DELTA } from "../letter.types";
import { Image } from "../../image/entities";
import { PredictionTable } from "@server/src/prediction/entities";

@Entity()
@ObjectType()
export class LetterElement extends AbstractEntity {
  @Field(() => Int)
  @Column("int")
  sequence: number;

  @Column({ type: "text", default: DEFAULT_QUILL_DELTA })
  @Field({ nullable: true })
  textDelta?: string;

  @Column("int", { nullable: true }) imageId?: number;
  @Field(() => Image, { nullable: true })
  @OneToOne(() => Image, { nullable: true })
  @JoinColumn()
  image?: Image;

  @Column("int") letterId: number;
  @ManyToOne(() => Letter, (letter) => letter.letterElements)
  @Field(() => Letter)
  letter: Letter;

  @Column("int") letterElementTypeId: number;
  @ManyToOne(() => LetterElementType)
  @Field(() => LetterElementType)
  letterElementType: LetterElementType;

  @Column({ type: "int", nullable: true }) surveyDimensionId: number;
  @ManyToOne(() => SurveyDimension, { nullable: true })
  @Field(() => SurveyDimension, { nullable: true })
  surveyDimension?: SurveyDimension;

  @Column({ type: "int", nullable: true }) predictionTableId: number;
  @Field(() => PredictionTable)
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
