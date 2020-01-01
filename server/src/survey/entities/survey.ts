import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany } from "typeorm";
import { SurveyItem, SurveyItemCreateInput } from "./survey-item";
import { SurveyDimension } from "./survey-dimension";
import { AbstractEntity } from "../../shared/abstract-entity";
import { ScriptureEngagementPractice } from "../../prediction/entities";
import { Letter } from "../../letter/entities";
import { SurveyResponse } from "./survey-response";

@Entity()
@ObjectType({
  description: "All information about a survey imported from Qualtrics"
})
export class Survey extends AbstractEntity {
  @OneToMany(
    type => Letter,
    letter => letter.survey
  )
  @Field(type => [Letter])
  letters: Letter[];

  @OneToMany(
    type => SurveyItem,
    item => item.survey
  )
  @Field(type => [SurveyItem], {
    description:
      "All the Qualtrics items for this survey; for groupings, see survey dimension and index."
  })
  surveyItems: SurveyItem[];

  @OneToMany(
    type => SurveyDimension,
    dimension => dimension.survey
  )
  @Field(type => [SurveyDimension], {
    description:
      "Dimensions for this survey; groups indices, which group items."
  })
  surveyDimensions: SurveyDimension[];

  @OneToMany(
    type => SurveyResponse,
    response => response.survey
  )
  @Field(type => [SurveyResponse], { description: "Responses for this survey" })
  surveyResponses: SurveyResponse[];

  @Column()
  @Field({ description: "Unique identifier for this survey on Qualtrics" })
  qualtricsId: string;

  @Column()
  @Field({ description: "Name of this survey on Qualtrics" })
  qualtricsName: string;

  @Column()
  @Field({
    description: "Date and time at which this survey was modified on Qualtrics"
  })
  qualtricsModDate: string;

  @Field(type => [ScriptureEngagementPractice], {
    description: "Convenience property to retrieve SE practices"
  })
  scriptureEngagementPractices: ScriptureEngagementPractice[];
}

@InputType()
export class SurveyCreateInput {
  @Field() qualtricsId: string;
  @Field() qualtricsName: string;
  @Field() qualtricsModDate: string;
  @Field(type => [SurveyItemCreateInput]) surveyItems: SurveyItemCreateInput[];
}

@InputType()
export class SurveyUpdateInput {
  @Field(type => Int) id: number;
  @Field({ nullable: true }) qualtricsId?: string;
  @Field({ nullable: true }) qualtricsName?: string;
  @Field({ nullable: true }) qualtricsModDate?: string;
}
