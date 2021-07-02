import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Entity, ManyToOne, OneToMany } from "typeorm";
import { SurveyIndex } from "./survey-index";
import { Survey } from "./survey";
import { AbstractEntity } from "../../shared/abstract-entity";
import { SurveyItemResponse } from "./survey-item-response";
import { FieldColumn } from "@server/src/decorators";

@Entity()
@ObjectType({ description: "One item (question) from a survey" })
export class SurveyItem extends AbstractEntity {
  @Field(() => Survey)
  @ManyToOne(() => Survey, (survey) => survey.surveyItems)
  survey: Survey;

  @Field(() => SurveyIndex, { nullable: true })
  @ManyToOne(() => SurveyIndex, (idx) => idx.surveyItems, {
    nullable: true,
  })
  surveyIndex: SurveyIndex;

  @Field(() => [SurveyItemResponse])
  @OneToMany(() => SurveyItemResponse, (siResp) => siResp.surveyItem)
  surveyItemResponses: SurveyItemResponse[];

  @FieldColumn("Qualtrics identifier (value of key in `questions` object)")
  qualtricsId: string;

  @FieldColumn("Qualtrics `questionName` field", { nullable: true })
  qualtricsName?: string;

  @FieldColumn("Qualtrics `questionText` field")
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
  @Field(() => Int, { defaultValue: -1 }) sequence?: number;
  @Field() qualtricsId: string;
  @Field() qualtricsText: string;
}
