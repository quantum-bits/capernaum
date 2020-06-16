/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LetterCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddLetter
// ====================================================

export interface AddLetter_createLetter {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  description: string;
  updated: any;
  isFrozen: boolean;
}

export interface AddLetter {
  createLetter: AddLetter_createLetter;
}

export interface AddLetterVariables {
  createInput: LetterCreateInput;
}
