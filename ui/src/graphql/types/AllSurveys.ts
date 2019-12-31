/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllSurveys
// ====================================================

export interface AllSurveys_surveys_letters {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
}

export interface AllSurveys_surveys {
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
  letters: AllSurveys_surveys_letters[];
}

export interface AllSurveys {
  surveys: AllSurveys_surveys[];
}
