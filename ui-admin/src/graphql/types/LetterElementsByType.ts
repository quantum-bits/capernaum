/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: LetterElementsByType
// ====================================================

export interface LetterElementsByType_elementsByLetterType_letterElementTypes {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Letter element type name
   */
  key: string;
  /**
   * Letter element type description
   */
  description: string;
}

export interface LetterElementsByType_elementsByLetterType {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Letter type name
   */
  key: string;
  /**
   * Letter type description
   */
  description: string;
  letterElementTypes: LetterElementsByType_elementsByLetterType_letterElementTypes[];
}

export interface LetterElementsByType {
  elementsByLetterType: LetterElementsByType_elementsByLetterType[];
}
