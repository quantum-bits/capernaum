/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllResponses
// ====================================================

export interface AllResponses_surveyResponses_survey_letter {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  description: string;
  emailMessage: string;
}

export interface AllResponses_surveyResponses_survey {
  /**
   * Unique identifier for this survey on Qualtrics
   */
  qualtricsId: string;
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
  /**
   * Fetch the (optional) letter for this survey
   */
  letter: AllResponses_surveyResponses_survey_letter | null;
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
