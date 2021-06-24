/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SurveyIndexUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateIndex
// ====================================================

export interface UpdateIndex_updateSurveyIndex_surveyItems {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Qualtrics identifier (value of key in `questions` object)
   */
  qualtricsId: string;
  /**
   * Qualtrics `questionText` field
   */
  qualtricsText: string;
}

export interface UpdateIndex_updateSurveyIndex {
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
  surveyItems: UpdateIndex_updateSurveyIndex_surveyItems[];
}

export interface UpdateIndex {
  /**
   * Update an index. Field values will replaces existing values in the object.
   *       (e.g., if you give a value for itemIds, it will replace the current list.)
   */
  updateSurveyIndex: UpdateIndex_updateSurveyIndex;
}

export interface UpdateIndexVariables {
  updateInput: SurveyIndexUpdateInput;
}
