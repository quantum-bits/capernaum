import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { SurveyDimension } from "./survey-dimension";
import { SurveyItem } from "./survey-item";
import { AbstractEntity } from "../../shared/abstract-entity";
import { PredictionTableEntry } from "../../prediction/entities";
import { mean } from "lodash";

@Entity()
@ObjectType({ description: "Collection of survey items, grouped for analysis" })
export class SurveyIndex extends AbstractEntity {
  @ManyToOne(
    type => SurveyDimension,
    dimension => dimension.surveyIndices
  )
  @Field(type => SurveyDimension)
  surveyDimension: SurveyDimension;
  @Column("integer")
  surveyDimensionId: number;

  @Column({ default: true })
  @Field({
    description: "Use this index in prediction tables?"
  })
  useForPredictions: boolean;

  @OneToMany(
    type => SurveyItem,
    item => item.surveyIndex
  )
  @Field(type => [SurveyItem])
  surveyItems: SurveyItem[];

  @OneToMany(
    type => PredictionTableEntry,
    ptEntry => ptEntry.surveyIndex
  )
  @Field(type => [PredictionTableEntry])
  predictionTableEntries: PredictionTableEntry[];

  @Column()
  @Field({ description: "Abbreviation for this index (e.g., 'FOG')" })
  abbreviation: string;

  @Column()
  @Field({ description: "Title of this index" })
  title: string;

  private surveyItemResponses() {
    return this.surveyItems.map(surveyItem => surveyItem.surveyItemResponse());
  }

  public meanResponse() {
    return mean(
      this.surveyItemResponses().map(
        surveyItemResponse => surveyItemResponse.value
      )
    );
  }
}

@InputType()
export class SurveyIndexCreateInput implements Partial<SurveyIndex> {
  @Field(type => Int, {
    description: "ID of the dimension to contain this index"
  })
  surveyDimensionId: number;

  @Field(type => [Int], {
    description: "List of IDs of the items to include in this index."
  })
  itemIds: number[];

  @Field({ description: "Abbreviation for this index (e.g., 'FOG')" })
  abbreviation: string;

  @Field({ description: "Title of this index within the dimension" })
  title: string;

  @Column({ default: true })
  @Field({
    description: "Use this index in prediction tables?"
  })
  useForPredictions: boolean;
}

@InputType()
export class SurveyIndexUpdateInput implements Partial<SurveyIndex> {
  @Field(type => Int) id: number;
  @Field(type => [Int], { nullable: true }) itemIds?: number[];
  @Field({ nullable: true }) abbreviation?: string;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) useForPredictions?: boolean;
}

@ObjectType()
export class SurveyIndexDeleteOutput {
  @Field(type => Int, { description: "ID of deleted index" })
  deletedIndexId: number;

  @Field(type => [Int], {
    description: "IDs of items removed from the deleted index"
  })
  deletedItemIds: number[];
}
