/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SurveyIndexCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddIndex
// ====================================================

export interface AddIndex_createSurveyIndex_surveyItems {
  /**
   * Text of this question from Qualtrics
   */
  qualtricsText: string;
}

export interface AddIndex_createSurveyIndex {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Title of this index
   */
  title: string;
  /**
   * Abbreviation for this index (e.g., 'FOG')
   */
  abbreviation: string;
  surveyItems: AddIndex_createSurveyIndex_surveyItems[];
}

export interface AddIndex {
  /**
   * Create a survey index. Can add survey items directly by item ID.
   */
  createSurveyIndex: AddIndex_createSurveyIndex;
}

export interface AddIndexVariables {
  createInput: SurveyIndexCreateInput;
}
