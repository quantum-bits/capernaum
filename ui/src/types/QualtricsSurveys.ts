/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QualtricsSurveys
// ====================================================

export interface QualtricsSurveys_qualtricsSurveys {
  __typename: "QualtricsSurveyListItem";
  qualtricsId: string;
  qualtricsOwnerId: string;
  qualtricsName: string;
  qualtricsModDate: string;
  qualtricsIsActive: boolean;
  qualtricsCreationDate: string;
}

export interface QualtricsSurveys {
  qualtricsSurveys: QualtricsSurveys_qualtricsSurveys[];
}

export interface QualtricsSurveysVariables {
  includeInactive?: boolean | null;
}
