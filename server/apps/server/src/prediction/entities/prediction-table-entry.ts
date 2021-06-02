import { Column, Entity, ManyToOne, Index } from "typeorm";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { SurveyIndex } from "../../survey/entities";
import { ScriptureEngagementPractice } from "./scripture-engagement-practice";
import { Letter } from "../../letter/entities";
import { AbstractEntity } from "../../shared/abstract-entity";

/**
 * This entity is a ternary association table.
 */
@Entity()
@Index(["letter", "surveyIndex", "practice"], { unique: true })
@ObjectType({ description: "One entry in a prediction table" })
export class PredictionTableEntry extends AbstractEntity {
  @Column("int") letterId: number;
  @ManyToOne(() => Letter, { primary: true })
  @Field(() => [PredictionTableEntry])
  letter: Letter;

  @Column("int") surveyIndexId: number;
  @ManyToOne(() => SurveyIndex, { primary: true })
  @Field(() => SurveyIndex)
  surveyIndex: SurveyIndex;

  @Column("int") practiceId: number;
  @ManyToOne(() => ScriptureEngagementPractice, { primary: true })
  @Field(() => ScriptureEngagementPractice)
  practice: ScriptureEngagementPractice;

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
