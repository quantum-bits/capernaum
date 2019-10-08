/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ChangeDimension
// ====================================================

export interface ChangeDimension_updateSurveyDimension_surveyIndices_surveyItems {
  /**
   * Text of this question from Qualtrics
   */
  qualtricsText: string;
}

export interface ChangeDimension_updateSurveyDimension_surveyIndices {
  /**
   * Title of this index
   */
  title: string;
  surveyItems: ChangeDimension_updateSurveyDimension_surveyIndices_surveyItems[];
}

export interface ChangeDimension_updateSurveyDimension {
  /**
   * Title of this dimension (e.g., 'Focus on Prayer')
   */
  title: string;
  /**
   * Sequence number; dimension are displayed in this order.
   */
  sequence: number;
  surveyIndices: ChangeDimension_updateSurveyDimension_surveyIndices[];
}

export interface ChangeDimension {
  updateSurveyDimension: ChangeDimension_updateSurveyDimension;
}

export interface ChangeDimensionVariables {
  id: number;
  title: string;
  sequence: number;
}
