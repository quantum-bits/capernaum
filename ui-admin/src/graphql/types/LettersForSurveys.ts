/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: LettersForSurveys
// ====================================================

export interface LettersForSurveys_letterTypes {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Letter type name
   */
  key: string;
  /**
   * Letter type description
   */
  description: string;
}

export interface LettersForSurveys_surveys {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
}

export interface LettersForSurveys {
  letterTypes: LettersForSurveys_letterTypes[];
  /**
   * Fetch all surveys
   */
  surveys: LettersForSurveys_surveys[];
}
