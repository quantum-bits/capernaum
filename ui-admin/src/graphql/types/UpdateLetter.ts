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
  /**
   * Letter title
   */
  title: string;
  /**
   * Description of letter
   */
  description: string;
  /**
   * Email message to go out with letter
   */
  emailMessage: string;
}

export interface UpdateLetter {
  updateLetter: UpdateLetter_updateLetter;
}

export interface UpdateLetterVariables {
  letterData: LetterUpdateInput;
}
