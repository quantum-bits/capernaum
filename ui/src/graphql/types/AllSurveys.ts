/* tslint:disable */
/* eslint-disable */
// @generated
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
  /**
   * Fetch the letters for this survey
   */
  letters: AllSurveys_surveys_letters[];
  /**
   * Dimensions for this survey; groups indices, which group items.
   */
  surveyDimensions: AllSurveys_surveys_surveyDimensions[];
  /**
   * All the Qualtrics items for this survey; 
   *     for groupings, see survey dimension and index.
   *     Pass 'whichItems' to choose which to return (default 'All')
   */
  surveyItems: AllSurveys_surveys_surveyItems[];
  /**
   * Responses for this survey
   */
  surveyResponses: AllSurveys_surveys_surveyResponses[];
}

export interface AllSurveys {
  surveys: AllSurveys_surveys[];
}
