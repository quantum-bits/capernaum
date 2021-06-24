/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ImportSurveyResponses
// ====================================================

export interface ImportSurveyResponses_importQualtricsSurveyResponses_surveyResponses {
  /**
   * Time to complete (seconds)
   */
  duration: number;
  /**
   * Respondent's email address
   */
  email: string;
  /**
   * Qualtrics response ID (e.g., R_...)
   */
  qualtricsResponseId: string;
  /**
   * When survey was started
   */
  startDate: string;
  /**
   * When survey was completed
   */
  endDate: string;
}

export interface ImportSurveyResponses_importQualtricsSurveyResponses {
  importCount: number;
  duplicateCount: number;
  surveyResponses: ImportSurveyResponses_importQualtricsSurveyResponses_surveyResponses[];
}

export interface ImportSurveyResponses {
  /**
   * Fetch responses to a survey
   */
  importQualtricsSurveyResponses: ImportSurveyResponses_importQualtricsSurveyResponses;
}

export interface ImportSurveyResponsesVariables {
  qId: string;
}
