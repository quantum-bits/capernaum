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
@ObjectType()
export class SurveyIndex {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @ManyToOne(type => SurveyDimension, dimension => dimension.surveyIndices)
  surveyDimension: SurveyDimension;

  @OneToMany(type => SurveyItem, item => item.surveyIndex)
  surveyItems: SurveyItem[];

  @Column() @Field() title: string;
}

@InputType()
export class SurveyIndexCreateInput implements Partial<SurveyIndex> {
  @Field(type => Int) dimensionId: number;
  @Field(type => [Int]) itemIds: number[];
  @Field() title: string;
}

@InputType()
export class SurveyIndexUpdateInput implements Partial<SurveyIndex> {
  @Field(type => Int) id: number;
  @Field(type => [Int], { nullable: true }) itemIds?: number[];
  @Field({ nullable: true }) title?: string;
}

@ObjectType()
export class SurveyIndexDeleteOutput {
  @Field(type => Int) deletedIndexId: number;
  @Field(type => [Int]) deletedItemIds: number[];
}
