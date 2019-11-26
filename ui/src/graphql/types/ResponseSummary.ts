/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ResponseSummary
// ====================================================

export interface ResponseSummary_surveyResponses_survey_letters {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  description: string;
}

export interface ResponseSummary_surveyResponses_survey {
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
  letters: ResponseSummary_surveyResponses_survey_letters[];
}

export interface ResponseSummary_surveyResponses {
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
