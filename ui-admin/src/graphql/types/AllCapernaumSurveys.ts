/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllCapernaumSurveys
// ====================================================

export interface AllCapernaumSurveys_surveys_letters_letterType {
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

export interface AllCapernaumSurveys_surveys_letters {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Letter title
   */
  title: string;
  letterType: AllCapernaumSurveys_surveys_letters_letterType;
}

export interface AllCapernaumSurveys_surveys_surveyDimensions {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface AllCapernaumSurveys_surveys_surveyItems {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface AllCapernaumSurveys_surveys_surveyResponses {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface AllCapernaumSurveys_surveys {
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
   * Make this survey available to groups?
   */
  okayForGroup: boolean;
  /**
   * Public name for survey (e.g., in group sign-up)
   */
  publicName: string;
  /**
   * Detailed description of this survey; mostly for group use
   */
  detailedDescription: string;
  /**
   * Fetch the letters for this survey
   */
  letters: AllCapernaumSurveys_surveys_letters[];
  /**
   * Dimensions for this survey; groups indices, which group items.
   */
  surveyDimensions: AllCapernaumSurveys_surveys_surveyDimensions[];
  /**
   * All the Qualtrics items for this survey; 
   *     for groupings, see survey dimension and index.
   *     Pass 'whichItems' to choose which to return (default 'All')
   */
  surveyItems: AllCapernaumSurveys_surveys_surveyItems[];
  /**
   * Responses for this survey
   */
  surveyResponses: AllCapernaumSurveys_surveys_surveyResponses[];
}

export interface AllCapernaumSurveys {
  surveys: AllCapernaumSurveys_surveys[];
}