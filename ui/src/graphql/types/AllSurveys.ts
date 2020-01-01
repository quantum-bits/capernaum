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

export interface AllSurveys_surveys_surveyDimensions {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface AllSurveys_surveys_surveyItems {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface AllSurveys_surveys_surveyResponses {
  /**
   * Unique ID for this entity
   */
  id: number;
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
  surveyDimensions: AllSurveys_surveys_surveyDimensions[];
  /**
   * Retrieve survey items; pass `whichItems` to choose which to return (default `All`)
   */
  surveyItems: AllSurveys_surveys_surveyItems[];
  surveyResponses: AllSurveys_surveys_surveyResponses[];
}

export interface AllSurveys {
  surveys: AllSurveys_surveys[];
}
