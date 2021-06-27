/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CombinedSurveys
// ====================================================

export interface CombinedSurveys_combinedSurveys_capernaumSurvey {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * When this survey was imported from Qualtrics
   */
  importedDate: any | null;
}

export interface CombinedSurveys_combinedSurveys {
  qualtricsId: string;
  qualtricsOwnerId: string;
  qualtricsName: string;
  qualtricsModDate: string;
  qualtricsIsActive: boolean;
  qualtricsCreationDate: string;
  /**
   * Associated Capernaum survey, if any
   */
  capernaumSurvey: CombinedSurveys_combinedSurveys_capernaumSurvey | null;
}

export interface CombinedSurveys {
  combinedSurveys: CombinedSurveys_combinedSurveys[];
}
