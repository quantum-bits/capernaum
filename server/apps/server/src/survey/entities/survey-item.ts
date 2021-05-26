import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { SurveyIndex } from "./survey-index";
import { Survey } from "./survey";
import { AbstractEntity } from "../../shared/abstract-entity";
import { SurveyItemResponse } from "./survey-item-response";

@Entity()
@ObjectType({ description: "One item (question) from a survey" })
export class SurveyItem extends AbstractEntity {
  @ManyToOne(() => Survey, (survey) => survey.surveyItems)
  @Field(() => Survey)
  survey: Survey;
  @Column("integer", { nullable: true })
  surveyId: number;

  @ManyToOne(() => SurveyIndex, (surveyIndex) => surveyIndex.surveyItems, {
    nullable: true,
  })
  @Field(() => SurveyIndex, { nullable: true })
  surveyIndex: SurveyIndex;
  @Column("integer", { nullable: true })
  surveyIndexId: number;

  @OneToMany(
    () => SurveyItemResponse,
    (surveyItemResponse) => surveyItemResponse.surveyItem
  )
  @Field(() => [SurveyItemResponse])
  surveyItemResponses: SurveyItemResponse[];

  @Column("integer", { default: -1 })
  @Field(() => Int, {
    description: "Sequence number; items will be displayed in this order",
  })
  sequence: number;

  @Column()
  @Field({
    description: "Qualtrics identifier (value of key in `questions` object)",
  })
  qualtricsId: string;

  @Column({ nullable: true })
  @Field({ description: "Qualtrics `questionName` field", nullable: true })
  qualtricsName?: string;

  @Column()
  @Field({ description: "Qualtrics `questionText` field" })
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
