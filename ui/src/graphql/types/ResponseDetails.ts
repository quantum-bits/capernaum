/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ResponseDetails
// ====================================================

export interface ResponseDetails_surveyResponse_survey_surveyDimensions_surveyIndices_predictionTableEntries_practice {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
}

export interface ResponseDetails_surveyResponse_survey_surveyDimensions_surveyIndices_predictionTableEntries {
  practice: ResponseDetails_surveyResponse_survey_surveyDimensions_surveyIndices_predictionTableEntries_practice;
}

export interface ResponseDetails_surveyResponse_survey_surveyDimensions_surveyIndices_surveyItems_surveyItemResponse {
  value: number;
  label: string;
}

export interface ResponseDetails_surveyResponse_survey_surveyDimensions_surveyIndices_surveyItems {
  /**
   * Qualtrics identifier for this question
   */
  qualtricsId: string;
  /**
   * Text of this question from Qualtrics
   */
  qualtricsText: string;
  surveyItemResponse: ResponseDetails_surveyResponse_survey_surveyDimensions_surveyIndices_surveyItems_surveyItemResponse | null;
}

export interface ResponseDetails_surveyResponse_survey_surveyDimensions_surveyIndices {
  /**
   * Title of this index
   */
  title: string;
  /**
   * Abbreviation for this index (e.g., 'FOG')
   */
  abbreviation: string;
  predictionTableEntries: ResponseDetails_surveyResponse_survey_surveyDimensions_surveyIndices_predictionTableEntries[];
  surveyItems: ResponseDetails_surveyResponse_survey_surveyDimensions_surveyIndices_surveyItems[];
}

export interface ResponseDetails_surveyResponse_survey_surveyDimensions {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Title of this dimension (e.g., 'Focus on Prayer')
   */
  title: string;
  /**
   * Use this dimension in prediction tables?
   */
  useForPredictions: boolean;
  surveyIndices: ResponseDetails_surveyResponse_survey_surveyDimensions_surveyIndices[];
}

export interface ResponseDetails_surveyResponse_survey {
  /**
   * Unique ID for this entity
   */
  id: number;
  surveyDimensions: ResponseDetails_surveyResponse_survey_surveyDimensions[];
}

export interface ResponseDetails_surveyResponse {
  /**
   * Unique ID for this entity
   */
  id: number;
  email: string;
  progress: number;
  qualtricsResponseId: string;
  survey: ResponseDetails_surveyResponse_survey;
}

export interface ResponseDetails {
  surveyResponse: ResponseDetails_surveyResponse;
}

export interface ResponseDetailsVariables {
  id: number;
}
