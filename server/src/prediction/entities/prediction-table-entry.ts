import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { SurveyIndex } from "../../survey/entities";
import { ScriptureEngagementPractice } from "./scripture-engagement-practice";
import { Letter } from "../../letter/entities";

/**
 * This entity is a ternary association table.
 */
@Entity()
@ObjectType({ description: "One entry in a prediction table" })
export class PredictionTableEntry {
  @PrimaryColumn("int") letterId: number;
  @ManyToOne(type => Letter, { primary: true })
  @Field(type => [PredictionTableEntry])
  letter: Letter;

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
  @Field(type => Int) letterId: number;
  @Field(type => Int) surveyIndexId: number;
  @Field(type => Int) practiceId: number;
  @Field(type => Int) sequence: number;
}

@InputType()
export class PredictionTableEntryUpdateInput {
  @Field(type => Int) id: number;
  @Field(type => Int, { nullable: true }) letterId?: number;
  @Field(type => Int, { nullable: true }) surveyIndexId?: number;
  @Field(type => Int, { nullable: true }) practiceId?: number;
  @Field(type => Int, { nullable: true }) sequence: number;
}
