/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OneLetter
// ====================================================

export interface OneLetter_letter_surveyLetters_survey {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
}

export interface OneLetter_letter_surveyLetters_letterType_letterElementTypes {
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

export interface OneLetter_letter_surveyLetters_letterType {
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
  letterElementTypes: OneLetter_letter_surveyLetters_letterType_letterElementTypes[];
}

export interface OneLetter_letter_surveyLetters {
  survey: OneLetter_letter_surveyLetters_survey;
  letterType: OneLetter_letter_surveyLetters_letterType;
}

export interface OneLetter_letter_letterElements_letterElementType {
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

export interface OneLetter_letter_letterElements_surveyDimension {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Title of this dimension (e.g., 'Focus on Prayer')
   */
  title: string;
}

export interface OneLetter_letter_letterElements_image {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Image title from user
   */
  title: string;
  url: string;
}

export interface OneLetter_letter_letterElements {
  letterElementType: OneLetter_letter_letterElements_letterElementType;
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * sequence number
   */
  sequence: number;
  /**
   * Quill text delta
   */
  textDelta: string | null;
  surveyDimension: OneLetter_letter_letterElements_surveyDimension | null;
  image: OneLetter_letter_letterElements_image | null;
}

export interface OneLetter_letter {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Letter title
   */
  title: string;
  /**
   * Date last updated
   */
  updated: any;
  /**
   * Description of letter
   */
  description: string;
  /**
   * Email message to go out with letter
   */
  emailMessage: string;
  /**
   * Survey letters for this letter
   */
  surveyLetters: OneLetter_letter_surveyLetters[];
  /**
   * Elements that make up this letter
   */
  letterElements: OneLetter_letter_letterElements[];
}

export interface OneLetter {
  letter: OneLetter_letter;
}

export interface OneLetterVariables {
  letterId: number;
}
