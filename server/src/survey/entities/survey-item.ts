import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { SurveyIndex } from "./survey-index";
import { Survey } from "./survey";
import { AbstractEntity } from "../../shared/abstract-entity";
import { SurveyItemResponse } from "./survey-item-response";

@Entity()
@ObjectType({ description: "One item (question) from a survey" })
export class SurveyItem extends AbstractEntity {
  @ManyToOne(type => Survey, survey => survey.surveyItems)
  @Field(type => Survey)
  survey: Survey;

  @ManyToOne(type => SurveyIndex, surveyIndex => surveyIndex.surveyItems, {
    nullable: true
  })
  @Field(type => SurveyIndex, { nullable: true })
  surveyIndex: SurveyIndex;
  @Column("integer", { nullable: true })
  surveyIndexId: number;

  @OneToMany(
    type => SurveyItemResponse,
    surveyItemResponse => surveyItemResponse.surveyItem
  )
  @Field(type => [SurveyItemResponse])
  surveyItemResponses: SurveyItemResponse[];

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

  public surveyItemResponse() {
    if (this.surveyItemResponses.length != 1) {
      throw Error(`Too many responses to survey item '${this.id}'`);
    }
    return this.surveyItemResponses[0];
  }
}

@InputType()
export class SurveyItemCreateInput {
  @Field(type => Int, { defaultValue: -1 }) sequence?: number;
  @Field() qualtricsId: string;
  @Field() qualtricsText: string;
}
