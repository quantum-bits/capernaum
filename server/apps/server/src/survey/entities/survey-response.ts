import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Survey } from "./survey";
import { AbstractEntity } from "../../shared/abstract-entity";
import { SurveyItemResponse } from "./survey-item-response";
import { Group } from "../../group/entities";
import { FieldColumn } from "@server/src/decorators";

@Entity()
@ObjectType({ description: "One user's response to a survey" })
export class SurveyResponse extends AbstractEntity {
  @Field(() => Group, {
    nullable: true,
    description: "Group for this response (if any)",
  })
  @ManyToOne(() => Group, (group) => group.surveyResponses)
  group?: Group;

  @Field(() => Survey, {
    description: "Survey for which this is a response",
  })
  @ManyToOne(() => Survey, (survey) => survey.surveyItems)
  survey: Survey;

  @Field(() => [SurveyItemResponse], {
    description: "Responses to individual items in the survey",
  })
  @OneToMany(
    () => SurveyItemResponse,
    (surveyItemResponse) => surveyItemResponse.surveyResponse
  )
  surveyItemResponses: SurveyItemResponse[];

  @FieldColumn("Respondent's email address")
  email: string;

  @FieldColumn("Group code word", { nullable: true })
  codeWord: string;

  @FieldColumn("Qualtrics response ID (e.g., R_...)")
  qualtricsResponseId: string;

  @FieldColumn("When survey was started")
  startDate: string;

  @FieldColumn("When survey was completed")
  endDate: string;

  @FieldColumn("When survey was recorded")
  recordedDate: string;

  @FieldColumn("Type of response", () => Int, { type: "integer" })
  status: number;

  @FieldColumn("Percent complete", () => Int, { type: "integer" })
  progress: number;

  @FieldColumn("Time to complete (seconds)", () => Int, { type: "integer" })
  duration: number;

  @Column("int")
  @FieldColumn("1 = Survey complete and submitted, 0 = otherwise", () => Int, {
    type: "integer",
  })
  finished: number;

  @FieldColumn("Respondent's IP address")
  ipAddress: string;

  @FieldColumn("Respondent's latitude")
  latitude: string;

  @FieldColumn("Respondent's longitude")
  longitude: string;
}
