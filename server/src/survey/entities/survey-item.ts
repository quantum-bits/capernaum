import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SurveyIndex } from "./survey-index";
import { Survey } from "./survey";

@Entity()
@ObjectType()
export class SurveyItem {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @ManyToOne(type => Survey, survey => survey.surveyItems)
  survey: Survey;

  @ManyToOne(type => SurveyIndex, surveyIndex => surveyIndex.surveyItems, {
    nullable: true
  })
  surveyIndex?: SurveyIndex;

  @Column("integer", { default: -1 })
  @Field(type => Int)
  sequence: number;

  @Column()
  @Field()
  qualtricsId: string;

  @Column()
  @Field()
  qualtricsText: string;
}

@InputType()
export class SurveyItemCreateInput {
  @Field(type => Int, { defaultValue: -1 }) sequence?: number;
  @Field() qualtricsId: string;
  @Field() qualtricsText: string;
}
