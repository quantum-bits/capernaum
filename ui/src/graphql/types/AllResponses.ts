/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllResponses
// ====================================================

export interface AllResponses_surveyResponses_survey_letters {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  description: string;
}

export interface AllResponses_surveyResponses_survey {
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
  letters: AllResponses_surveyResponses_survey_letters[];
}

export interface AllResponses_surveyResponses {
  /**
   * Unique ID for this entity
   */
  id: number;
  qualtricsResponseId: string;
  email: string;
  survey: AllResponses_surveyResponses_survey;
  startDate: string;
  endDate: string;
  duration: number;
  finished: number;
}

export interface AllResponses {
  surveyResponses: AllResponses_surveyResponses[];
}
