/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PredictionTableSummary
// ====================================================

export interface PredictionTableSummary_predictionTables_entries_practice {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  description: string;
  sequence: number;
}

export interface PredictionTableSummary_predictionTables_entries_surveyIndex_surveyItems {
  /**
   * Qualtrics identifier for this question
   */
  qualtricsId: string;
  /**
   * Text of this question from Qualtrics
   */
  qualtricsText: string;
}

export interface PredictionTableSummary_predictionTables_entries_surveyIndex {
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
  surveyItems: PredictionTableSummary_predictionTables_entries_surveyIndex_surveyItems[];
}

export interface PredictionTableSummary_predictionTables_entries {
  sequence: number;
  practice: PredictionTableSummary_predictionTables_entries_practice;
  surveyIndex: PredictionTableSummary_predictionTables_entries_surveyIndex;
}

export interface PredictionTableSummary_predictionTables {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  description: string;
  entries: PredictionTableSummary_predictionTables_entries[];
}

export interface PredictionTableSummary {
  predictionTables: PredictionTableSummary_predictionTables[];
}
