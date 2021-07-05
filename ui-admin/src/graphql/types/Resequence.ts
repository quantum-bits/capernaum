/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Resequence
// ====================================================

export interface Resequence_resequenceLetterElements_letterElementType {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Letter element type name
   */
  key: string;
}

export interface Resequence_resequenceLetterElements {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * sequence number
   */
  sequence: number;
  letterElementType: Resequence_resequenceLetterElements_letterElementType;
}

export interface Resequence {
  resequenceLetterElements: Resequence_resequenceLetterElements[];
}

export interface ResequenceVariables {
  letterElementIds: number[];
}
