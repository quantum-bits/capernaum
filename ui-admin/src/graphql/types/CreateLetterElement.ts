/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LetterElementCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateLetterElement
// ====================================================

export interface CreateLetterElement_createLetterElement_image {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Image title from user
   */
  title: string;
}

export interface CreateLetterElement_createLetterElement_surveyDimension {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Title of this dimension (e.g., 'Focus on Prayer')
   */
  title: string;
}

export interface CreateLetterElement_createLetterElement_letterElementType {
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

export interface CreateLetterElement_createLetterElement {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * sequence number
   */
  sequence: number;
  image: CreateLetterElement_createLetterElement_image | null;
  surveyDimension: CreateLetterElement_createLetterElement_surveyDimension | null;
  /**
   * Quill text delta
   */
  textDelta: string | null;
  letterElementType: CreateLetterElement_createLetterElement_letterElementType;
}

export interface CreateLetterElement {
  createLetterElement: CreateLetterElement_createLetterElement;
}

export interface CreateLetterElementVariables {
  createInput: LetterElementCreateInput;
}
