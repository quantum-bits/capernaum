/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ResponseDetails
// ====================================================

export interface ResponseDetails_surveyResponse_surveyItemResponses_surveyItem {
  /**
   * Qualtrics identifier for this question
   */
  qualtricsId: string;
  /**
   * Text of this question from Qualtrics
   */
  qualtricsText: string;
}

export interface ResponseDetails_surveyResponse_surveyItemResponses {
  surveyItem: ResponseDetails_surveyResponse_surveyItemResponses_surveyItem;
  label: string;
  value: number;
}

export interface ResponseDetails_surveyResponse {
  surveyItemResponses: ResponseDetails_surveyResponse_surveyItemResponses[];
}

export interface ResponseDetails {
  surveyResponse: ResponseDetails_surveyResponse;
}

export interface ResponseDetailsVariables {
  id: number;
}
