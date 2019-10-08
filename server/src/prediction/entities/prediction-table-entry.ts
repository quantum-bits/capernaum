import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { PredictionTable } from "./prediction-table";
import { SurveyIndex } from "../../survey/entities";
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
