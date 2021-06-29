import { Entity, ManyToOne, Index } from "typeorm";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { SurveyIndex } from "../../survey/entities";
import { ScriptureEngagementPractice } from "./scripture-engagement-practice";
import { AbstractEntity } from "../../shared/abstract-entity";
import { FieldColumn } from "@server/src/decorators";

/**
 * This entity is a ternary association table.
 */
@Entity()
@Index(["surveyIndex", "practice"], { unique: true })
@ObjectType({ description: "One entry in a prediction table" })
export class PredictionTableEntry extends AbstractEntity {
  @Field(() => SurveyIndex, {
    description: "Index containing this entry",
  })
  @ManyToOne(() => SurveyIndex, { primary: true })
  surveyIndex: SurveyIndex;

  @Field(() => ScriptureEngagementPractice, {
    description: "SE practice referred to by this entry",
  })
  @ManyToOne(
    () => ScriptureEngagementPractice,
    (sep) => sep.predictionTableEntries,
    { primary: true }
  )
  practice: ScriptureEngagementPractice;

  @FieldColumn("Sequence number", () => Int)
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
