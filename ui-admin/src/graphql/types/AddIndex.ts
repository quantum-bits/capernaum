/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SurveyIndexCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddIndex
// ====================================================

export interface AddIndex_surveyIndexCreate_scriptureEngagementPractices {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Practice title
   */
  title: string;
  /**
   * Description of this practice
   */
  description: string;
}

export interface AddIndex_surveyIndexCreate_surveyItems {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Qualtrics `questionText` field
   */
  qualtricsText: string;
}

export interface AddIndex_surveyIndexCreate {
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
  /**
   * Use this index in prediction tables?
   */
  useForPredictions: boolean;
  /**
   * Practices predicted by this index
   */
  scriptureEngagementPractices: AddIndex_surveyIndexCreate_scriptureEngagementPractices[];
  surveyItems: AddIndex_surveyIndexCreate_surveyItems[];
}

export interface AddIndex {
  /**
   * Create a survey index. Can add survey items directly by item ID.
   */
  surveyIndexCreate: AddIndex_surveyIndexCreate;
}

export interface AddIndexVariables {
  createInput: SurveyIndexCreateInput;
}
