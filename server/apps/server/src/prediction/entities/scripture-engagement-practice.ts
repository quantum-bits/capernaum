import { Entity, OneToMany } from "typeorm";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { AbstractEntity } from "../../shared/abstract-entity";
import { FieldColumn } from "@server/src/decorators";
import { PredictionTableEntry } from "@server/src/prediction/entities/prediction-table-entry";

@Entity()
@ObjectType({ description: "Scripture engagement practice" })
export class ScriptureEngagementPractice extends AbstractEntity {
  @FieldColumn("Practice title")
  title: string;

  @FieldColumn("Description of this practice", { type: "text" })
  description: string;

  @FieldColumn("URL for more information on practice")
  moreInfoUrl: string;

  @FieldColumn("Include this SEP in prediction counts?", { default: true })
  forPredictionCounts: boolean;

  @FieldColumn("Sequence number", () => Int)
  sequence: number;

  @Field(() => PredictionTableEntry, {
    description: "Prediction tables entries referring to this practice",
  })
  @OneToMany(() => PredictionTableEntry, (pte) => pte.practice)
  predictionTableEntries: PredictionTableEntry[];
}

@InputType()
export class ScriptureEngagementPracticeCreateInput {
  @Field() title: string;
  @Field() description: string;
  @Field() moreInfoUrl: string;
  @Field(() => Int) sequence: number;
}

@InputType()
export class ScriptureEngagementPracticeUpdateInput {
  @Field(() => Int) id: number;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) description?: string;
  @Field({ nullable: true }) moreInfoUrl: string;
  @Field(() => Int, { nullable: true }) sequence?: number;
}
