/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WhichItems } from "./globalTypes";

// ====================================================
// GraphQL query operation: OneSurvey
// ====================================================

export interface OneSurvey_survey_surveyItems {
  __typename: "SurveyItem";
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Sequence number; items will be displayed in this order
   */
  sequence: number;
  /**
   * Qualtrics identifier for this question
   */
  qualtricsId: string;
  /**
   * Text of this question from Qualtrics
   */
  qualtricsText: string;
}

export interface OneSurvey_survey_surveyDimensions_surveyIndices_surveyItems {
  __typename: "SurveyItem";
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Qualtrics identifier for this question
   */
  qualtricsId: string;
  /**
   * Text of this question from Qualtrics
   */
  qualtricsText: string;
}

export interface OneSurvey_survey_surveyDimensions_surveyIndices {
  __typename: "SurveyIndex";
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
  surveyItems: OneSurvey_survey_surveyDimensions_surveyIndices_surveyItems[];
}

export interface OneSurvey_survey_surveyDimensions {
  __typename: "SurveyDimension";
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Title of this dimension (e.g., 'Focus on Prayer')
   */
  title: string;
  /**
   * Sequence number; dimension are displayed in this order.
   */
  sequence: number;
  surveyIndices: OneSurvey_survey_surveyDimensions_surveyIndices[];
}

export interface OneSurvey_survey {
  __typename: "Survey";
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Title for this survey in Capernaum
   */
  title: string;
  /**
   * Retrieve survey items; pass `whichItems` to choose which to return (default `All`)
   */
  surveyItems: OneSurvey_survey_surveyItems[];
  surveyDimensions: OneSurvey_survey_surveyDimensions[];
}

export interface OneSurvey {
  survey: OneSurvey_survey;
}

export interface OneSurveyVariables {
  surveyId: number;
  which?: WhichItems | null;
}
