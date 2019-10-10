import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { PredictionTable } from "./prediction-table";
import { SurveyIndex, SurveyItemCreateInput } from "../../survey/entities";
import { ScriptureEngagementPractice } from "./scripture-engagement-practice";

/**
 * This entity is a ternary association table.
 */
@Entity()
@ObjectType({ description: "One entry in a prediction table" })
export class PredictionTableEntry {
  @PrimaryColumn("int") tableId: number;
  @ManyToOne(type => PredictionTable, { primary: true })
  @Field(type => [PredictionTableEntry])
  table: PredictionTable;

  @PrimaryColumn("int") surveyIndexId: number;
  @ManyToOne(type => SurveyIndex, { primary: true })
  @Field(type => SurveyIndex)
  surveyIndex: SurveyIndex;

  @PrimaryColumn("int") practiceId: number;
  @ManyToOne(type => ScriptureEngagementPractice, { primary: true })
  @Field(type => ScriptureEngagementPractice)
  practice: ScriptureEngagementPractice;

  @Column() @Field(type => Int) sequence: number;
}

@InputType()
export class PredictionTableEntryCreateInput {
  @Field(type => Int) tableId: number;
  @Field(type => Int) surveyIndexId: number;
  @Field(type => Int) practiceId: number;
  @Field(type => Int) sequence: number;
}

@InputType()
export class PredictionTableEntryUpdateInput {
  @Field(type => Int) id: number;
  @Field(type => Int, { nullable: true }) tableId?: number;
  @Field(type => Int, { nullable: true }) surveyIndexId?: number;
  @Field(type => Int, { nullable: true }) practiceId?: number;
  @Field(type => Int, { nullable: true }) sequence: number;
}
