import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { SurveyDimension } from "./survey-dimension";
import { SurveyItem } from "./survey-item";
import { AbstractEntity } from "../../shared/abstract-entity";
import { PredictionTableEntry } from "../../prediction/entities";
import { mean } from "lodash";

@Entity()
@ObjectType({ description: "Collection of survey items, grouped for analysis" })
export class SurveyIndex extends AbstractEntity {
  @ManyToOne(() => SurveyDimension, (dimension) => dimension.surveyIndices)
  @Field(() => SurveyDimension)
  surveyDimension: SurveyDimension;
  @Column("integer")
  surveyDimensionId: number;

  @Column({ default: true })
  @Field({
    description: "Use this index in prediction tables?",
  })
  useForPredictions: boolean;

  @OneToMany(() => SurveyItem, (item) => item.surveyIndex)
  @Field(() => [SurveyItem])
  surveyItems: SurveyItem[];

  @OneToMany(() => PredictionTableEntry, (ptEntry) => ptEntry.surveyIndex)
  @Field(() => [PredictionTableEntry])
  predictionTableEntries: PredictionTableEntry[];

  @Column()
  @Field({ description: "Abbreviation for this index (e.g., 'FOG')" })
  abbreviation: string;

  @Column()
  @Field({ description: "Title of this index" })
  title: string;

  private surveyItemResponses() {
    return this.surveyItems.map((surveyItem) =>
      surveyItem.surveyItemResponse()
    );
  }

  /**
   * Calculate the mean of the values from all responses to this survey item.
   */
  public meanResponse() {
    return mean(
      this.surveyItemResponses().map(
        (surveyItemResponse) => surveyItemResponse.value
      )
    );
  }
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
