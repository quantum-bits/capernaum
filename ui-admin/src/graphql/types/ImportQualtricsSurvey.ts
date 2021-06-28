/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ImportQualtricsSurvey
// ====================================================

export interface ImportQualtricsSurvey_importQualtricsSurvey_surveyItems {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Qualtrics `questionText` field
   */
  qualtricsText: string;
}

export interface ImportQualtricsSurvey_importQualtricsSurvey {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * When this survey was imported from Qualtrics
   */
  importedDate: any | null;
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
   * All the Qualtrics items for this survey; 
   *     for groupings, see survey dimension and index.
   *     Pass 'whichItems' to choose which to return (default 'All')
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
