/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LetterElementUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateLetterElement
// ====================================================

export interface UpdateLetterElement_updateLetterElement {
  /**
   * Unique ID for this entity
   */
  id: number;
  sequence: number;
}

export interface UpdateLetterElement {
  updateLetterElement: UpdateLetterElement_updateLetterElement;
}

export interface UpdateLetterElementVariables {
  updateInput: LetterElementUpdateInput;
}
