import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { SurveyDimension } from "./survey-dimension";
import { SurveyItem } from "./survey-item";
import { AbstractEntity } from "../../shared/abstract-entity";
import { FieldColumn } from "@server/src/decorators";
import { ScriptureEngagementPractice } from "@server/src/prediction/entities";

@Entity()
@ObjectType({ description: "Collection of survey items, grouped for analysis" })
export class SurveyIndex extends AbstractEntity {
  @Field(() => SurveyDimension)
  @ManyToOne(() => SurveyDimension, (dimension) => dimension.surveyIndices)
  surveyDimension: SurveyDimension;

  @FieldColumn("Use this index in prediction tables?", { default: true })
  useForPredictions: boolean;

  @Field(() => [SurveyItem])
  @OneToMany(() => SurveyItem, (item) => item.surveyIndex)
  surveyItems: SurveyItem[];

  @Field(() => [ScriptureEngagementPractice], {
    description: "Practices predicted by this index",
  })
  @ManyToMany(() => ScriptureEngagementPractice, (sep) => sep.surveyIndices)
  @JoinTable({ name: "prediction_table_entry" })
  scriptureEngagementPractices: ScriptureEngagementPractice[];

  @FieldColumn("Abbreviation for this index (e.g., 'FOG')")
  abbreviation: string;

  @FieldColumn("Title of this index")
  title: string;
}

@InputType()
export class SurveyIndexCreateInput implements Partial<SurveyIndex> {
  @Field(() => Int, {
    description: "ID of the dimension to contain this index",
  })
  surveyDimensionId: number;

  @Field(() => [Int], {
    description: "List of IDs of the items to include in this index.",
  })
  itemIds: number[];

  @Field({ description: "Abbreviation for this index (e.g., 'FOG')" })
  abbreviation: string;

  @Field({ description: "Title of this index within the dimension" })
  title: string;

  @Column({ default: true })
  @Field({
    description: "Use this index in prediction tables?",
  })
  useForPredictions: boolean;
}

@InputType()
export class SurveyIndexUpdateInput implements Partial<SurveyIndex> {
  @Field(() => Int) id: number;
  @Field(() => [Int], { nullable: true }) itemIds?: number[];
  @Field({ nullable: true }) abbreviation?: string;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) useForPredictions?: boolean;
}

@ObjectType()
export class SurveyIndexDeleteOutput {
  @Field(() => Int, { description: "ID of deleted index" })
  deletedIndexId: number;

  @Field(() => [Int], {
    description: "IDs of items removed from the deleted index",
  })
  deletedItemIds: number[];
}
