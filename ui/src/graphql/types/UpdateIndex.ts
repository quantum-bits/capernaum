/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateIndex
// ====================================================

export interface UpdateIndex_updateSurveyIndex_surveyItems {
  __typename: "SurveyItem";
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Qualtrics identifier for this question
   */
  qualtricsId: string;
  /**
   * Text of this question from Qualtrics
   */
  qualtricsText: string;
}

export interface UpdateIndex_updateSurveyIndex {
  __typename: "SurveyIndex";
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
  surveyItems: UpdateIndex_updateSurveyIndex_surveyItems[];
}

export interface UpdateIndex {
  /**
   * Update an index. Field values will replaces existing values in the object.
   *       (e.g., if you give a value for itemIds, it will replace the current list.
   */
  updateSurveyIndex: UpdateIndex_updateSurveyIndex;
}

export interface UpdateIndexVariables {
  id: number;
  itemIds: number[];
  title: string;
  abbreviation: string;
}
