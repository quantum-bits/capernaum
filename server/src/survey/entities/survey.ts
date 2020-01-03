import { InputType, Int, ObjectType, Field } from "type-graphql";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
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
  @Column("int", { nullable: true })
  letterId?: number;

  @OneToOne(
    type => Letter,
    letter => letter.survey
  )
  @JoinColumn()
  @Field({ nullable: true })
  letter?: Letter;

  @OneToMany(
    type => SurveyItem,
    item => item.survey
  )
  @Field(type => [SurveyItem])
  surveyItems: SurveyItem[];

  @OneToMany(
    type => SurveyDimension,
    dimension => dimension.survey
  )
  @Field(type => [SurveyDimension])
  surveyDimensions: SurveyDimension[];

  @OneToMany(
    type => SurveyResponse,
    response => response.survey
  )
  @Field(type => [SurveyResponse])
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
