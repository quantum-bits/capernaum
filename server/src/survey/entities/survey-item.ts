import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SurveyIndex } from "./survey-index";
import { Survey } from "./survey";

@Entity()
@ObjectType({ description: "One item (question) from a survey" })
export class SurveyItem {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @ManyToOne(type => Survey, survey => survey.surveyItems)
  survey: Survey;

  @ManyToOne(type => SurveyIndex, surveyIndex => surveyIndex.surveyItems, {
    nullable: true
  })
  surveyIndex: SurveyIndex;

  @Column("integer", { default: -1 })
  @Field(type => Int, {
    description: "Sequence number; items will be displayed in this order"
  })
  sequence: number;

  @Column()
  @Field({ description: "Qualtrics identifier for this question" })
  qualtricsId: string;

  @Column()
  @Field({ description: "Text of this question from Qualtrics" })
  qualtricsText: string;
}

@InputType()
export class SurveyItemCreateInput {
  @Field(type => Int, { defaultValue: -1 }) sequence?: number;
  @Field() qualtricsId: string;
  @Field() qualtricsText: string;
}
