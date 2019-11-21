import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany } from "typeorm";
import { SurveyItem, SurveyItemCreateInput } from "./survey-item";
import { SurveyDimension } from "./survey-dimension";
import { AbstractEntity } from "../../shared/abstract-entity";
import { ScriptureEngagementPractice } from "../../prediction/entities";
import { Letter } from "../../letter/entities";

@Entity()
@ObjectType({
  description: "All information about a survey imported from Qualtrics"
})
export class Survey extends AbstractEntity {
  @OneToMany(type => Letter, letter => letter.survey)
  @Field(type => [Letter])
  letters: Letter[];

  @OneToMany(type => SurveyItem, item => item.survey)
  @Field(type => [SurveyItem], {
    description:
      "All the Qualtrics items for this survey; for groupings, see survey dimension and index."
  })
  surveyItems: SurveyItem[];

  @OneToMany(type => SurveyDimension, dimension => dimension.survey)
  @Field(type => [SurveyDimension], {
    description:
      "Dimensions for this survey; groups indices, which group items."
  })
  surveyDimensions: SurveyDimension[];

  @Column()
  @Field({ description: "Title for this survey in Capernaum" })
  title: string;

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
  @Field() title: string;
  @Field() qualtricsId: string;
  @Field() qualtricsName: string;
  @Field() qualtricsModDate: string;
  @Field(type => [SurveyItemCreateInput]) surveyItems: SurveyItemCreateInput[];
}

@InputType()
export class SurveyUpdateInput {
  @Field(type => Int) id: number;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) qualtricsId?: string;
  @Field({ nullable: true }) qualtricsName?: string;
  @Field({ nullable: true }) qualtricsModDate?: string;
}

@InputType()
export class QualtricsImportInput {
  @Field({ description: "Qualtrics unique identifier" })
  qualtricsId: string;
  @Field({ description: "Title for associated Capernaum survey" })
  title: string;
}
