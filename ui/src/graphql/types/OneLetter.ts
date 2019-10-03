/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OneLetter
// ====================================================

export interface OneLetter_letter {
  __typename: "Letter";
  /**
   * Unique ID for this entity
   */
  id: number;
  name: string;
  isFrozen: boolean;
}

export interface OneLetter {
  letter: OneLetter_letter;
}

export interface OneLetterVariables {
  letterId: number;
}
