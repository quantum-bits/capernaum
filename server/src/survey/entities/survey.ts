import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SurveyItem } from "./survey-item";
import { SurveyDimension } from "./survey-dimension";

@Entity()
@ObjectType()
export class Survey {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @OneToMany(type => SurveyItem, item => item.survey)
  @Field(type => [SurveyItem])
  surveyItems: SurveyItem[];

  @OneToMany(type => SurveyDimension, dimension => dimension.survey)
  @Field(type => [SurveyDimension])
  surveyDimensions: SurveyDimension[];

  @Field() @Column() title: string;
  @Field() @Column() qualtricsId: string;
  @Field() @Column() qualtricsName: string;
  @Field() @Column() qualtricsModDate: string;
}

@InputType()
export class SurveyCreateInput implements Partial<Survey> {
  @Field() title: string;
  @Field() qualtricsId: string;
  @Field() qualtricsName: string;
  @Field() qualtricsModDate: string;
}

@InputType()
export class SurveyUpdateInput {
  @Field(type => Int) id: number;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) qualtricsId?: string;
  @Field({ nullable: true }) qualtricsName: string;
  @Field({ nullable: true }) qualtricsModDate: string;
}
