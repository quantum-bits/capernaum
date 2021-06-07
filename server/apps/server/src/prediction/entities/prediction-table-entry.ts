import { Column, Entity, ManyToOne, Index } from "typeorm";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { SurveyIndex } from "../../survey/entities";
import { ScriptureEngagementPractice } from "./scripture-engagement-practice";
import { AbstractEntity } from "../../shared/abstract-entity";
import { PredictionTable } from "@server/src/prediction/entities/prediction-table";

/**
 * This entity is a ternary association table.
 */
@Entity()
@Index(["predictionTable", "surveyIndex", "practice"], { unique: true })
@ObjectType({ description: "One entry in a prediction table" })
export class PredictionTableEntry extends AbstractEntity {
  @Field(() => PredictionTable)
  @ManyToOne(
    () => PredictionTable,
    (predictionTable) => predictionTable.predictionTableEntries
  )
  predictionTable: PredictionTable;

  @Column("int") surveyIndexId: number;
  @ManyToOne(() => SurveyIndex, { primary: true })
  @Field(() => SurveyIndex)
  surveyIndex: SurveyIndex;

  @Column("int") practiceId: number;
  @ManyToOne(() => ScriptureEngagementPractice, { primary: true })
  @Field(() => ScriptureEngagementPractice)
  practice: ScriptureEngagementPractice;

  @Column("integer") predictionTableId: number;
  @Column()
  @Field(() => Int)
  sequence: number;
}

@InputType()
class PartialPredictionTableEntry {
  @Field(() => Int) surveyIndexId: number;
  @Field(() => Int) practiceId: number;
  @Field(() => Int) sequence: number;
}

@InputType()
export class PredictionTableEntryCreateInput extends PartialPredictionTableEntry {
  @Field(() => Int) letterId: number;
}

@InputType()
export class PredictionTableEntryUpdateInput {
  @Field(() => Int) id: number;
  @Field(() => Int, { nullable: true }) letterId?: number;
  @Field(() => Int, { nullable: true }) surveyIndexId: number;
  @Field(() => Int, { nullable: true }) practiceId: number;
  @Field(() => Int, { nullable: true }) sequence: number;
}

@InputType()
export class PredictionTableEntryReplaceInput {
  @Field(() => Int) letterId: number;
  @Field(() => [PartialPredictionTableEntry])
  entries: PartialPredictionTableEntry[];
}
