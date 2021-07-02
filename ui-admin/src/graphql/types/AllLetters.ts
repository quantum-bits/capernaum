/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllLetters
// ====================================================

export interface AllLetters_letters_surveyLetters_survey {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
}

export interface AllLetters_letters_surveyLetters_letterType_letterElementTypes {
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

export interface AllLetters_letters_surveyLetters_letterType {
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
  letterElementTypes: AllLetters_letters_surveyLetters_letterType_letterElementTypes[];
}

export interface AllLetters_letters_surveyLetters {
  survey: AllLetters_letters_surveyLetters_survey;
  letterType: AllLetters_letters_surveyLetters_letterType;
}

export interface AllLetters_letters_letterElements_letterElementType {
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

export interface AllLetters_letters_letterElements_surveyDimension {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Title of this dimension (e.g., 'Focus on Prayer')
   */
  title: string;
}

export interface AllLetters_letters_letterElements {
  letterElementType: AllLetters_letters_letterElements_letterElementType;
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
  surveyDimension: AllLetters_letters_letterElements_surveyDimension | null;
}

export interface AllLetters_letters {
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
   * Date last updated
   */
  updated: any;
  /**
   * Survey letters for this letter
   */
  surveyLetters: AllLetters_letters_surveyLetters[];
  /**
   * Elements that make up this letter
   */
  letterElements: AllLetters_letters_letterElements[];
}

export interface AllLetters {
  letters: AllLetters_letters[];
}
