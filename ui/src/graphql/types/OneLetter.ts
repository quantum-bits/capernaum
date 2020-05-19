/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OneLetter
// ====================================================

export interface OneLetter_letter_scriptureEngagementPractices {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  description: string;
  sequence: number;
}

export interface OneLetter_letter_tableEntries_surveyIndex_surveyItems {
  /**
   * Qualtrics identifier for this question
   */
  qualtricsId: string;
  /**
   * Text of this question from Qualtrics
   */
  qualtricsText: string;
}

export interface OneLetter_letter_tableEntries_surveyIndex {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Abbreviation for this index (e.g., 'FOG')
   */
  abbreviation: string;
  /**
   * Title of this index
   */
  title: string;
  surveyItems: OneLetter_letter_tableEntries_surveyIndex_surveyItems[];
}

export interface OneLetter_letter_tableEntries_practice {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface OneLetter_letter_tableEntries {
  surveyIndex: OneLetter_letter_tableEntries_surveyIndex;
  practice: OneLetter_letter_tableEntries_practice;
}

export interface OneLetter_letter_letterElements_letterElementType {
  /**
   * Unique ID for this entity
   */
  id: number;
  key: string;
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
  /**
   * Sequence number; dimension are displayed in this order.
   */
  sequence: number;
}

export interface OneLetter_letter_letterElements_image {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  url: string;
}

export interface OneLetter_letter_letterElements {
  letterElementType: OneLetter_letter_letterElements_letterElementType;
  /**
   * Unique ID for this entity
   */
  id: number;
  sequence: number;
  textDelta: string | null;
  surveyDimension: OneLetter_letter_letterElements_surveyDimension | null;
  image: OneLetter_letter_letterElements_image | null;
}

export interface OneLetter_letter_survey_surveyDimensions_survey {
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
}

export interface OneLetter_letter_survey_surveyDimensions_surveyIndices_surveyItems {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Qualtrics identifier for this question
   */
  qualtricsId: string;
  /**
   * Text of this question from Qualtrics
   */
  qualtricsText: string;
}

export interface OneLetter_letter_survey_surveyDimensions_surveyIndices {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Abbreviation for this index (e.g., 'FOG')
   */
  abbreviation: string;
  /**
   * Title of this index
   */
  title: string;
  /**
   * Use this index in prediction tables?
   */
  useForPredictions: boolean;
  surveyItems: OneLetter_letter_survey_surveyDimensions_surveyIndices_surveyItems[];
}

export interface OneLetter_letter_survey_surveyDimensions {
  survey: OneLetter_letter_survey_surveyDimensions_survey | null;
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Sequence number; dimension are displayed in this order.
   */
  sequence: number;
  /**
   * Title of this dimension (e.g., 'Focus on Prayer')
   */
  title: string;
  surveyIndices: OneLetter_letter_survey_surveyDimensions_surveyIndices[];
}

export interface OneLetter_letter_survey {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Unique identifier for this survey on Qualtrics
   */
  qualtricsId: string;
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
  /**
   * Dimensions for this survey; groups indices, which group items.
   */
  surveyDimensions: OneLetter_letter_survey_surveyDimensions[];
}

export interface OneLetter_letter {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  updated: any;
  description: string;
  isFrozen: boolean | null;
  emailMessage: string;
  scriptureEngagementPractices: OneLetter_letter_scriptureEngagementPractices[];
  tableEntries: OneLetter_letter_tableEntries[];
  letterElements: OneLetter_letter_letterElements[];
  survey: OneLetter_letter_survey;
}

export interface OneLetter {
  letter: OneLetter_letter;
}

export interface OneLetterVariables {
  letterId: number;
}
