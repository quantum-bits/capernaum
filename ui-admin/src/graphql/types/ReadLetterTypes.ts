/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ReadLetterTypes
// ====================================================

export interface ReadLetterTypes_readLetterTypes {
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
}

export interface ReadLetterTypes {
  readLetterTypes: ReadLetterTypes_readLetterTypes[];
}
