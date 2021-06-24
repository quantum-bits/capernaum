/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SurveyDimensionCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddDimension
// ====================================================

export interface AddDimension_createSurveyDimension_surveyIndices_surveyItems {
  /**
   * Qualtrics identifier (value of key in `questions` object)
   */
  qualtricsId: string;
  /**
   * Qualtrics `questionText` field
   */
  qualtricsText: string;
}

export interface AddDimension_createSurveyDimension_surveyIndices {
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
  surveyItems: AddDimension_createSurveyDimension_surveyIndices_surveyItems[];
}

export interface AddDimension_createSurveyDimension {
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
  surveyIndices: AddDimension_createSurveyDimension_surveyIndices[];
}

export interface AddDimension {
  /**
   * Create a survey dimension.
   */
  createSurveyDimension: AddDimension_createSurveyDimension;
}

export interface AddDimensionVariables {
  createInput: SurveyDimensionCreateInput;
}
