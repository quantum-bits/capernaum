/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Letters
// ====================================================

export interface Letters_letters_scriptureEngagementPractices {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  description: string;
  sequence: number;
}

export interface Letters_letters_tableEntries_surveyIndex_surveyItems {
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

export interface Letters_letters_tableEntries_surveyIndex {
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
  surveyItems: Letters_letters_tableEntries_surveyIndex_surveyItems[];
}

export interface Letters_letters_tableEntries {
  /**
   * Unique ID for this entity
   */
  id: number;
  surveyIndex: Letters_letters_tableEntries_surveyIndex;
}

export interface Letters_letters_letterElements_letterElementType {
  /**
   * Unique ID for this entity
   */
  id: number;
  key: string;
  description: string;
}

export interface Letters_letters_letterElements_surveyDimension {
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

export interface Letters_letters_letterElements {
  letterElementType: Letters_letters_letterElements_letterElementType;
  /**
   * Unique ID for this entity
   */
  id: number;
  sequence: number;
  textDelta: string | null;
  surveyDimension: Letters_letters_letterElements_surveyDimension | null;
}

export interface Letters_letters_survey_surveyDimensions_survey {
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
}

export interface Letters_letters_survey_surveyDimensions_surveyIndices_surveyItems {
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

export interface Letters_letters_survey_surveyDimensions_surveyIndices {
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
  surveyItems: Letters_letters_survey_surveyDimensions_surveyIndices_surveyItems[];
}

export interface Letters_letters_survey_surveyDimensions {
  /**
   * Unique ID for this entity
   */
  id: number;
  survey: Letters_letters_survey_surveyDimensions_survey | null;
  /**
   * Sequence number; dimension are displayed in this order.
   */
  sequence: number;
  /**
   * Title of this dimension (e.g., 'Focus on Prayer')
   */
  title: string;
  surveyIndices: Letters_letters_survey_surveyDimensions_surveyIndices[];
}

export interface Letters_letters_survey {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Title for this survey in Capernaum
   */
  title: string;
  /**
   * Unique identifier for this survey on Qualtrics
   */
  qualtricsId: string;
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
  surveyDimensions: Letters_letters_survey_surveyDimensions[];
}

export interface Letters_letters {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  description: string;
  updated: any;
  isFrozen: boolean | null;
  scriptureEngagementPractices: Letters_letters_scriptureEngagementPractices[];
  tableEntries: Letters_letters_tableEntries[];
  letterElements: Letters_letters_letterElements[];
  survey: Letters_letters_survey;
}

export interface Letters {
  letters: Letters_letters[];
}
