/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PredictionTableSummary
// ====================================================

export interface PredictionTableSummary_predictionTables_surveyLetter_survey {
  /**
   * Title for this survey in Capernaum
   */
  title: string;
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface PredictionTableSummary_predictionTables_surveyLetter {
  isActive: boolean;
  isFrozen: boolean;
  survey: PredictionTableSummary_predictionTables_surveyLetter_survey;
}

export interface PredictionTableSummary_predictionTables {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  description: string;
  surveyLetter: PredictionTableSummary_predictionTables_surveyLetter;
}

export interface PredictionTableSummary {
  predictionTables: PredictionTableSummary_predictionTables[];
}
