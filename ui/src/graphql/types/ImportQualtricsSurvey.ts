/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ImportQualtricsSurvey
// ====================================================

export interface ImportQualtricsSurvey_importQualtricsSurvey_surveyItems {
  /**
   * Text of this question from Qualtrics
   */
  qualtricsText: string;
}

export interface ImportQualtricsSurvey_importQualtricsSurvey {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Unique identifier for this survey on Qualtrics
   */
  qualtricsId: string;
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
  /**
   * Date and time at which this survey was modified on Qualtrics
   */
  qualtricsModDate: string;
  /**
   * Retrieve survey items; pass `whichItems` to choose which to return (default `All`)
   */
  surveyItems: ImportQualtricsSurvey_importQualtricsSurvey_surveyItems[];
}

export interface ImportQualtricsSurvey {
  /**
   * Import a survey from Qualtrics. Always use this to create a Capernaum survey.
   */
  importQualtricsSurvey: ImportQualtricsSurvey_importQualtricsSurvey;
}

export interface ImportQualtricsSurveyVariables {
  qualtricsId: string;
}
