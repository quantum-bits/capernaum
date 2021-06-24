/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LetterElementCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateLetterElement
// ====================================================

export interface CreateLetterElement_createLetterElement {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * sequence number
   */
  sequence: number;
}

export interface CreateLetterElement {
  createLetterElement: CreateLetterElement_createLetterElement;
}

export interface CreateLetterElementVariables {
  createInput: LetterElementCreateInput;
}
