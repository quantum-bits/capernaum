/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LetterUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateLetter
// ====================================================

export interface UpdateLetter_updateLetter {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  description: string;
  updated: any;
  isFrozen: boolean;
}

export interface UpdateLetter {
  updateLetter: UpdateLetter_updateLetter;
}

export interface UpdateLetterVariables {
  letterData: LetterUpdateInput;
}
