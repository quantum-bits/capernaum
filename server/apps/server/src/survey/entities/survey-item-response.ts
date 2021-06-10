import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { SurveyResponse } from "./survey-response";
import { SurveyItem } from "./survey-item";
import { FieldColumn } from "@server/src/decorators";

@Entity()
@ObjectType({ description: "One user's response to a single survey question" })
export class SurveyItemResponse extends AbstractEntity {
  @Field(() => SurveyResponse)
  @ManyToOne(() => SurveyResponse, (survey) => survey.surveyItemResponses)
  surveyResponse: SurveyResponse;

  @Field(() => SurveyItem)
  @ManyToOne(() => SurveyItem, (surveyItem) => surveyItem.surveyItemResponses)
  surveyItem: SurveyItem;

  @FieldColumn("Qualtrics question label")
  label: string;

  @FieldColumn("Qualtrics question response", () => Int)
  value: number;
}
