import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { SurveyResponse } from "./survey-response";
import { SurveyItem } from "./survey-item";

@Entity()
@ObjectType({ description: "One user's response to a single survey question" })
export class SurveyItemResponse extends AbstractEntity {
  @ManyToOne(type => SurveyResponse, survey => survey.surveyItemResponses)
  @Field(type => SurveyResponse)
  surveyResponse: SurveyResponse;

  @ManyToOne(type => SurveyItem, surveyItem => surveyItem.surveyItemResponses)
  @Field(type => SurveyItem)
  surveyItem: SurveyItem;

  @Column()
  @Field()
  label: string;

  @Column("int")
  @Field(type => Int)
  value: number;
}
