/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { WhichItems } from "./globalTypes";

// ====================================================
// GraphQL query operation: OneSurvey
// ====================================================

export interface OneSurvey_survey_surveyItems {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Sequence number; items displayed in order
   */
  sequence: number;
  /**
   * Qualtrics identifier (value of key in `questions` object)
   */
  qualtricsId: string;
  /**
   * Qualtrics `questionText` field
   */
  qualtricsText: string;
}

export interface OneSurvey_survey_surveyDimensions_surveyIndices_predictionTableEntries {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface OneSurvey_survey_surveyDimensions_surveyIndices_surveyItems {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Qualtrics identifier (value of key in `questions` object)
   */
  qualtricsId: string;
  /**
   * Qualtrics `questionText` field
   */
  qualtricsText: string;
}

export interface OneSurvey_survey_surveyDimensions_surveyIndices {
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
  predictionTableEntries: OneSurvey_survey_surveyDimensions_surveyIndices_predictionTableEntries[];
  surveyItems: OneSurvey_survey_surveyDimensions_surveyIndices_surveyItems[];
}

export interface OneSurvey_survey_surveyDimensions {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Title of this dimension (e.g., 'Focus on Prayer')
   */
  title: string;
  /**
   * Sequence number
   */
  sequence: number;
  surveyIndices: OneSurvey_survey_surveyDimensions_surveyIndices[];
}

export interface OneSurvey_survey {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
  /**
   * All the Qualtrics items for this survey; 
   *     for groupings, see survey dimension and index.
   *     Pass 'whichItems' to choose which to return (default 'All')
   */
  surveyItems: OneSurvey_survey_surveyItems[];
  /**
   * Dimensions for this survey; groups indices, which group items.
   */
  surveyDimensions: OneSurvey_survey_surveyDimensions[];
}

export interface OneSurvey {
  survey: OneSurvey_survey;
}

export interface OneSurveyVariables {
  surveyId: number;
  which?: WhichItems | null;
}
