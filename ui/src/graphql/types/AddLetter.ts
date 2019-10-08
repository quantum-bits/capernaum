/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddLetter
// ====================================================

export interface AddLetter_createLetter {
  /**
   * Unique ID for this entity
   */
  id: number;
  name: string;
}

export interface AddLetter {
  createLetter: AddLetter_createLetter;
}

export interface AddLetterVariables {
  name: string;
}
