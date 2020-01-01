/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ImportSurveyResponses
// ====================================================

export interface ImportSurveyResponses_importQualtricsSurveyResponses_surveyResponses {
  duration: number;
  email: string;
  qualtricsResponseId: string;
  startDate: string;
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
