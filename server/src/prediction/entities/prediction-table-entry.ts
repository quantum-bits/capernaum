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
  @ManyToOne(type => PredictionTable, { primary: true })
  @Field(type => [PredictionTableEntry])
  table: PredictionTable;

  @ManyToOne(type => SurveyIndex, { primary: true })
  @Field(type => SurveyIndex)
  surveyIndex: SurveyIndex;

  @ManyToOne(type => ScriptureEngagementPractice, { primary: true })
  @Field(type => ScriptureEngagementPractice)
  practice: ScriptureEngagementPractice;

  @Column() @Field(type => Int) sequence: number;
}
