import { ScriptureEngagementPractice } from "../prediction/entities";
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { SurveyResponse } from "./entities";

// Used to filter which survey items are retrieved for a survey.
export enum WhichItems {
  All,
  WithIndex,
  WithoutIndex,
}

@ObjectType()
export class PredictionDetails {
  @Field() surveyIndexTitle: string;
  @Field() surveyIndexAbbreviation: string;
  @Field(() => Float) meanResponse: number;
}

@ObjectType()
export class Prediction {
  @Field(() => ScriptureEngagementPractice)
  practice: ScriptureEngagementPractice;

  @Field(() => [PredictionDetails])
  details: PredictionDetails[];

  @Field({ description: "Should we predict this practice?" })
  predict: boolean;
}

/**
 * Summary of the number of times a given practice has been predicted.
 */
export interface PredictionCount {
  practiceId: number;
  practiceTitle: string;
  predictCount: number;
}

@ObjectType()
export class DimensionDetails {
  @Field(() => Int) indexId: number;
  @Field() indexTitle: string;
  @Field(() => Float) meanSurveyIndex: number;
}

@ObjectType()
export class Dimension {
  @Field(() => Int) id: number;
  @Field() title: string;
  @Field(() => [DimensionDetails]) details: DimensionDetails[];
}

@ObjectType()
export class QualtricsResponseImportStats {
  @Field(() => Int) importCount: number;
  @Field(() => Int) duplicateCount: number;
  @Field(() => [SurveyResponse]) surveyResponses: SurveyResponse[];

  constructor() {
    this.importCount = 0;
    this.duplicateCount = 0;
    this.surveyResponses = [];
  }
}

export interface QualtricsImportedResponse {
  isDuplicate: boolean;
  surveyResponse: SurveyResponse;
}

// N.B., the values of this enum are used elsewhere (e.g., in fixtures
// that create the LetterType table) where they are used as `string`s.
// Change with caution.
export enum SurveyRespondentType {
  Individual = "individual",
  Group = "group",
}
