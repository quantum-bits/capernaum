import { InputType, Int, ObjectType, Field } from "@nestjs/graphql";
import { Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { SurveyItem, SurveyItemCreateInput } from "./survey-item";
import { SurveyDimension } from "./survey-dimension";
import { AbstractEntity } from "../../shared/abstract-entity";
import { ScriptureEngagementPractice } from "../../prediction/entities";
import { Letter } from "../../letter/entities";
import { Group } from "../../group/entities/group";
import { SurveyResponse } from "./survey-response";
import { FieldColumn } from "@server/src/decorators";

@Entity()
@ObjectType({
  description: "All information about a survey imported from Qualtrics",
})
export class Survey extends AbstractEntity {
  @Field(() => [Letter])
  @ManyToMany(() => Letter, (letter) => letter.surveys)
  @JoinTable({ name: "survey_letter" })
  letters: Letter[];

  @Field(() => [SurveyItem])
  @OneToMany(() => SurveyItem, (item) => item.survey)
  surveyItems: SurveyItem[];

  @Field(() => [Group])
  @OneToMany(() => Group, (group) => group.survey)
  groups: Group[];

  @Field(() => [SurveyDimension])
  @OneToMany(() => SurveyDimension, (dimension) => dimension.survey)
  surveyDimensions: SurveyDimension[];

  @Field(() => [SurveyResponse])
  @OneToMany(() => SurveyResponse, (response) => response.survey)
  surveyResponses: SurveyResponse[];

  @FieldColumn("Unique identifier for this survey on Qualtrics")
  qualtricsId: string;

  @FieldColumn("Name of this survey on Qualtrics")
  qualtricsName: string;

  @FieldColumn("Date and time at which this survey was modified on Qualtrics")
  qualtricsModDate: string;

  @FieldColumn("Key of response value containing email address", {
    default: "??",
  })
  emailKey: string;

  @FieldColumn("Key of response value containing group code", { default: "??" })
  groupCodeKey: string;

  @FieldColumn("Make this survey available to groups?", { default: false })
  okayForGroup: boolean;

  @FieldColumn("Public name for survey (e.g., in group sign-up)", {
    default: "",
  })
  publicName: string;

  @FieldColumn("Detailed description of this survey; mostly for group use", {
    default: "",
  })
  detailedDescription: string;

  // TODO - Figure out where/why this is used.
  @Field(() => [ScriptureEngagementPractice], {
    description: "Convenience property to retrieve SE practices",
  })
  scriptureEngagementPractices: ScriptureEngagementPractice[];

  /**
   * Find a Capernaum item (corresponds to Qualtrics question) by Qualtrics ID
   * @param qualtricsId - qualtrics ID for item
   */
  findItem(qualtricsId: string): SurveyItem {
    return this.surveyItems.find((item) => item.qualtricsId === qualtricsId);
  }

  /**
   * Check whether the survey has a qualtrics item with the given ID.
   * @param qualtricsId - Id of item (Qualtrics question) to check
   */
  hasItem(qualtricsId: string): boolean {
    return !!this.findItem(qualtricsId);
  }
}

@InputType()
export class SurveyCreateInput {
  @Field() qualtricsId: string;
  @Field() qualtricsName: string;
  @Field() qualtricsModDate: string;
  @Field() emailKey: string;
  @Field() groupCodeKey: string;
  @Field() okayForGroup: boolean;
  @Field() publicName: string;
  @Field() detailedDescription: string;
  @Field(() => [SurveyItemCreateInput])
  surveyItems: SurveyItemCreateInput[];
}

@InputType()
export class SurveyUpdateInput {
  @Field(() => Int) id: number;
  @Field({ nullable: true }) qualtricsId?: string;
  @Field({ nullable: true }) qualtricsName?: string;
  @Field({ nullable: true }) qualtricsModDate?: string;
  @Field({ nullable: true }) emailKey?: string;
  @Field({ nullable: true }) groupCodeKey?: string;
  @Field({ nullable: true }) okayForGroup?: boolean;
  @Field({ nullable: true }) publicName?: string;
  @Field({ nullable: true }) detailedDescription?: string;
}
