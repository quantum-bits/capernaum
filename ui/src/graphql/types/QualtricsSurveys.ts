/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QualtricsSurveys
// ====================================================

export interface QualtricsSurveys_qualtricsSurveys {
  qualtricsId: string;
  qualtricsOwnerId: string;
  qualtricsName: string;
  qualtricsModDate: string;
  qualtricsIsActive: boolean;
  qualtricsCreationDate: string;
  importedToCapernaum: boolean;
}

export interface QualtricsSurveys {
  qualtricsSurveys: QualtricsSurveys_qualtricsSurveys[];
}

export interface QualtricsSurveysVariables {
  includeInactive?: boolean | null;
}
