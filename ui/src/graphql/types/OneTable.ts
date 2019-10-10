/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OneTable
// ====================================================

export interface OneTable_predictionTable_entries_practice {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  description: string;
  sequence: number;
}

export interface OneTable_predictionTable_entries_surveyIndex_surveyItems {
  /**
   * Qualtrics identifier for this question
   */
  qualtricsId: string;
  /**
   * Text of this question from Qualtrics
   */
  qualtricsText: string;
}

export interface OneTable_predictionTable_entries_surveyIndex {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Abbreviation for this index (e.g., 'FOG')
   */
  abbreviation: string;
  /**
   * Title of this index
   */
  title: string;
  surveyItems: OneTable_predictionTable_entries_surveyIndex_surveyItems[];
}

export interface OneTable_predictionTable_entries {
  sequence: number;
  practice: OneTable_predictionTable_entries_practice;
  surveyIndex: OneTable_predictionTable_entries_surveyIndex;
}

export interface OneTable_predictionTable {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  description: string;
  entries: OneTable_predictionTable_entries[];
}

export interface OneTable {
  predictionTable: OneTable_predictionTable;
}

export interface OneTableVariables {
  predictionTableId: number;
}
