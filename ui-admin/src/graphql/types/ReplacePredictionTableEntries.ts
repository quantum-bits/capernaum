/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PredictionTableEntryReplaceInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ReplacePredictionTableEntries
// ====================================================

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
  /**
   * Practice title
   */
  title: string;
  /**
   * Sequence number
   */
  sequence: number;
  /**
   * Description of this practice
   */
  description: string;
}

export interface ReplacePredictionTableEntries_replacePredictionTableEntries {
  /**
   * Unique ID for this entity
   */
  id: number;
  surveyIndex: ReplacePredictionTableEntries_replacePredictionTableEntries_surveyIndex;
  practice: ReplacePredictionTableEntries_replacePredictionTableEntries_practice;
  /**
   * Sequence number
   */
  sequence: number;
}

export interface ReplacePredictionTableEntries {
  replacePredictionTableEntries: ReplacePredictionTableEntries_replacePredictionTableEntries[];
}

export interface ReplacePredictionTableEntriesVariables {
  replaceInput: PredictionTableEntryReplaceInput;
}
