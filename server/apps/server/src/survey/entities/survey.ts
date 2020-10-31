import { InputType, Int, ObjectType, Field } from "@nestjs/graphql";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { SurveyItem, SurveyItemCreateInput } from "./survey-item";
import { SurveyDimension } from "./survey-dimension";
import { AbstractEntity } from "../../shared/abstract-entity";
import { ScriptureEngagementPractice } from "../../prediction/entities";
import { Group, Letter } from "../../letter/entities";
import { SurveyResponse } from "./survey-response";

@Entity()
@ObjectType({
  description: "All information about a survey imported from Qualtrics",
})
export class Survey extends AbstractEntity {
  @OneToMany((type) => Letter, (letter) => letter.survey)
  @Field((type) => [Letter])
  letters: Letter[];

  @OneToMany((type) => SurveyItem, (item) => item.survey)
  @Field((type) => [SurveyItem])
  surveyItems: SurveyItem[];

  @OneToMany((type) => Group, (item) => item.survey)
  @Field((type) => [Group])
  groups: Group[];

  @OneToMany((type) => SurveyDimension, (dimension) => dimension.survey)
  @Field((type) => [SurveyDimension])
  surveyDimensions: SurveyDimension[];

  @OneToMany((type) => SurveyResponse, (response) => response.survey)
  @Field((type) => [SurveyResponse])
  surveyResponses: SurveyResponse[];

  @Column()
  @Field({ description: "Unique identifier for this survey on Qualtrics" })
  qualtricsId: string;

  @Column()
  @Field({ description: "Name of this survey on Qualtrics" })
  qualtricsName: string;

  @Column()
  @Field({
    description: "Date and time at which this survey was modified on Qualtrics",
  })
  qualtricsModDate: string;

  @Column({ default: "??" })
  @Field({
    description: "Key of response value containing email address",
  })
  emailKey: string;

  @Column({ default: "??" })
  @Field({
    description: "Key of response value containing group code",
  })
  groupCodeKey: string;

  @Field((type) => [ScriptureEngagementPractice], {
    description: "Convenience property to retrieve SE practices",
  })
  scriptureEngagementPractices: ScriptureEngagementPractice[];

  /**
   * Find a Capernaum item (corresponds to Qualtrics question) by Qualtrics ID
   * @param qualtricsId - qualtrics ID for item
   */
  findItem(qualtricsId: string) {
    return this.surveyItems.find((item) => item.qualtricsId === qualtricsId);
  }

  /**
   * Check whether the survey has a qualtrics item with the given ID.
   * @param qualtricsId - Id of item (Qualtrics question) to check
   */
  hasItem(qualtricsId: string) {
    return !!this.findItem(qualtricsId);
  }
}

@InputType()
export class SurveyCreateInput {
  @Field() qualtricsId: string;
  @Field() qualtricsName: string;
  @Field() qualtricsModDate: string;
  @Field((type) => [SurveyItemCreateInput])
  surveyItems: SurveyItemCreateInput[];
}

@InputType()
export class SurveyUpdateInput {
  @Field((type) => Int) id: number;
  @Field({ nullable: true }) qualtricsId?: string;
  @Field({ nullable: true }) qualtricsName?: string;
  @Field({ nullable: true }) qualtricsModDate?: string;
}
