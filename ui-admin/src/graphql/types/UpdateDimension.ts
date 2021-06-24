/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SurveyDimensionUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateDimension
// ====================================================

export interface UpdateDimension_updateSurveyDimension_surveyIndices_surveyItems {
  /**
   * Qualtrics `questionText` field
   */
  qualtricsText: string;
}

export interface UpdateDimension_updateSurveyDimension_surveyIndices {
  /**
   * Title of this index
   */
  title: string;
  /**
   * Use this index in prediction tables?
   */
  useForPredictions: boolean;
  surveyItems: UpdateDimension_updateSurveyDimension_surveyIndices_surveyItems[];
}

export interface UpdateDimension_updateSurveyDimension {
  /**
   * Title of this dimension (e.g., 'Focus on Prayer')
   */
  title: string;
  /**
   * Sequence number
   */
  sequence: number;
  surveyIndices: UpdateDimension_updateSurveyDimension_surveyIndices[];
}

export interface UpdateDimension {
  /**
   * Update an existing survey dimension
   */
  updateSurveyDimension: UpdateDimension_updateSurveyDimension;
}

export interface UpdateDimensionVariables {
  updateInput: SurveyDimensionUpdateInput;
}
