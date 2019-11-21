/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QualtricsSurveys
// ====================================================

export interface QualtricsSurveys_qualtricsSurveys_importedAs {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface QualtricsSurveys_qualtricsSurveys {
  qualtricsId: string;
  qualtricsOwnerId: string;
  qualtricsName: string;
  qualtricsModDate: string;
  qualtricsIsActive: boolean;
  qualtricsCreationDate: string;
  importedAs: QualtricsSurveys_qualtricsSurveys_importedAs[];
}

export interface QualtricsSurveys {
  qualtricsSurveys: QualtricsSurveys_qualtricsSurveys[];
}

export interface QualtricsSurveysVariables {
  includeInactive?: boolean | null;
}
