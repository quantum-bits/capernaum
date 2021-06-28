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

export interface AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices_predictionTableEntries_practice {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Practice title
   */
  title: string;
}

export interface AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices_predictionTableEntries {
  /**
   * Unique ID for this entity
   */
  id: number;
  practice: AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices_predictionTableEntries_practice;
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
  predictionTableEntries: AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices_predictionTableEntries[];
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
   * Fetch the letters for this survey
   */
  letters: AllCapernaumSurveys_surveys_letters[];
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
