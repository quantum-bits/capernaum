/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ResponseSummary
// ====================================================

export interface ResponseSummary_surveyResponses_survey {
  __typename: "Survey";
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
}

export interface ResponseSummary_surveyResponses {
  __typename: "SurveyResponse";
  /**
   * Unique ID for this entity
   */
  id: number;
  qualtricsResponseId: string;
  email: string;
  survey: ResponseSummary_surveyResponses_survey;
  startDate: string;
  endDate: string;
  duration: number;
  finished: number;
}

export interface ResponseSummary {
  surveyResponses: ResponseSummary_surveyResponses[];
}
