/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllCapernaumSurveys
// ====================================================

export interface AllCapernaumSurveys_surveys_surveyLetters_letter {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Letter title
   */
  title: string;
}

export interface AllCapernaumSurveys_surveys_surveyLetters_letterType {
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

export interface AllCapernaumSurveys_surveys_surveyLetters {
  /**
   * The letter
   */
  letter: AllCapernaumSurveys_surveys_surveyLetters_letter;
  /**
   * The letter type
   */
  letterType: AllCapernaumSurveys_surveys_surveyLetters_letterType;
}

export interface AllCapernaumSurveys_surveys_surveyItems {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Qualtrics `questionText` field
   */
  qualtricsText: string;
}

export interface AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices_surveyItems {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Qualtrics `questionText` field
   */
  qualtricsText: string;
}

export interface AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices_scriptureEngagementPractices {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Practice title
   */
  title: string;
}

export interface AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Title of this index
   */
  title: string;
  /**
   * Abbreviation for this index (e.g., 'FOG')
   */
  abbreviation: string;
  /**
   * Use this index in prediction tables?
   */
  useForPredictions: boolean;
  surveyItems: AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices_surveyItems[];
  /**
   * Practices predicted by this index
   */
  scriptureEngagementPractices: AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices_scriptureEngagementPractices[];
}

export interface AllCapernaumSurveys_surveys_surveyDimensions {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Title of this dimension (e.g., 'Focus on Prayer')
   */
  title: string;
  surveyIndices: AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices[];
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
   * Survey letters for this survey
   */
  surveyLetters: AllCapernaumSurveys_surveys_surveyLetters[];
  /**
   * All the Qualtrics items for this survey; 
   *     for groupings, see survey dimension and index.
   *     Pass 'whichItems' to choose which to return (default 'All')
   */
  surveyItems: AllCapernaumSurveys_surveys_surveyItems[];
  /**
   * Dimensions for this survey; groups indices, which group items.
   */
  surveyDimensions: AllCapernaumSurveys_surveys_surveyDimensions[];
}

export interface AllCapernaumSurveys {
  /**
   * Fetch all surveys
   */
  surveys: AllCapernaumSurveys_surveys[];
}
