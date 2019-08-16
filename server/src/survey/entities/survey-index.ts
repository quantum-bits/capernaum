import { Field, Int, ObjectType } from "type-graphql";
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
