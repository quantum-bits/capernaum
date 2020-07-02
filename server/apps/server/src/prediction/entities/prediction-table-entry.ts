import { Column, Entity, ManyToOne, PrimaryColumn, Index } from "typeorm";
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
  @ManyToOne((type) => Letter, { primary: true })
  @Field((type) => [PredictionTableEntry])
  letter: Letter;

  @Column("int") surveyIndexId: number;
  @ManyToOne((type) => SurveyIndex, { primary: true })
  @Field((type) => SurveyIndex)
  surveyIndex: SurveyIndex;

  @Column("int") practiceId: number;
  @ManyToOne((type) => ScriptureEngagementPractice, { primary: true })
  @Field((type) => ScriptureEngagementPractice)
  practice: ScriptureEngagementPractice;

  @Column() @Field((type) => Int) sequence: number;
}

@InputType()
class PartialPredictionTableEntry {
  @Field((type) => Int) surveyIndexId: number;
  @Field((type) => Int) practiceId: number;
  @Field((type) => Int) sequence: number;
}

@InputType()
export class PredictionTableEntryCreateInput extends PartialPredictionTableEntry {
  @Field((type) => Int) letterId: number;
}

@InputType()
export class PredictionTableEntryUpdateInput {
  @Field((type) => Int) id: number;
  @Field((type) => Int, { nullable: true }) letterId?: number;
  @Field((type) => Int, { nullable: true }) surveyIndexId: number;
  @Field((type) => Int, { nullable: true }) practiceId: number;
  @Field((type) => Int, { nullable: true }) sequence: number;
}

@InputType()
export class PredictionTableEntryReplaceInput {
  @Field((type) => Int) letterId: number;
  @Field((type) => [PartialPredictionTableEntry])
  entries: PartialPredictionTableEntry[];
}
