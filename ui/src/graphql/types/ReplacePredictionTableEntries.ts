/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PredictionTableEntryReplaceInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ReplacePredictionTableEntries
// ====================================================

export interface ReplacePredictionTableEntries_replacePredictionTableEntries_letter {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface ReplacePredictionTableEntries_replacePredictionTableEntries_surveyIndex {
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
}

export interface ReplacePredictionTableEntries_replacePredictionTableEntries_practice {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  sequence: number;
  description: string;
}

export interface ReplacePredictionTableEntries_replacePredictionTableEntries {
  /**
   * Unique ID for this entity
   */
  id: number;
  letter: ReplacePredictionTableEntries_replacePredictionTableEntries_letter;
  surveyIndex: ReplacePredictionTableEntries_replacePredictionTableEntries_surveyIndex;
  practice: ReplacePredictionTableEntries_replacePredictionTableEntries_practice;
  sequence: number;
}

export interface ReplacePredictionTableEntries {
  replacePredictionTableEntries: ReplacePredictionTableEntries_replacePredictionTableEntries[];
}

export interface ReplacePredictionTableEntriesVariables {
  replaceInput: PredictionTableEntryReplaceInput;
}
