/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SurveyDimensionUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateDimension
// ====================================================

export interface UpdateDimension_updateSurveyDimension_surveyIndices_surveyItems {
  /**
   * Text of this question from Qualtrics
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
   * Sequence number; dimension are displayed in this order.
   */
  sequence: number;
  surveyIndices: UpdateDimension_updateSurveyDimension_surveyIndices[];
}

export interface UpdateDimension {
  updateSurveyDimension: UpdateDimension_updateSurveyDimension;
}

export interface UpdateDimensionVariables {
  updateInput: SurveyDimensionUpdateInput;
}
