import { Field, InputType, Int, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { SurveyDimension } from "./survey-dimension";
import { SurveyItem } from "./survey-item";

@Entity()
@ObjectType({ description: "Collection of survey items, grouped for analysis" })
export class SurveyIndex {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @ManyToOne(type => SurveyDimension, dimension => dimension.surveyIndices)
  surveyDimension: SurveyDimension;

  @OneToMany(type => SurveyItem, item => item.surveyIndex)
  surveyItems: SurveyItem[];

  @Column() @Field({ description: "Title of this index" }) title: string;
}

@InputType()
export class SurveyIndexCreateInput implements Partial<SurveyIndex> {
  @Field(type => Int, {
    description: "ID of the dimension to contain this index"
  })
  dimensionId: number;

  @Field(type => [Int], {
    description: "List of IDs of the items to include in this index."
  })
  itemIds: number[];

  @Field({ description: "Title of this index within the dimension" })
  title: string;
}

@InputType()
export class SurveyIndexUpdateInput implements Partial<SurveyIndex> {
  @Field(type => Int) id: number;
  @Field(type => [Int], { nullable: true }) itemIds?: number[];
  @Field({ nullable: true }) title?: string;
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
