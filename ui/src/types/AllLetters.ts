/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllLetters
// ====================================================

export interface AllLetters_letters {
  __typename: "Letter";
  /**
   * Unique ID for this entity
   */
  id: number;
  name: string;
  created: any;
  updated: any;
  isFrozen: boolean;
}

export interface AllLetters {
  letters: AllLetters_letters[];
}
