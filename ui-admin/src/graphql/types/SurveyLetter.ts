/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SurveyLetter
// ====================================================

export interface SurveyLetter_surveyLetter_survey_surveyDimensions_surveyIndices {
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
}

export interface SurveyLetter_surveyLetter_survey_surveyDimensions {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Title of this dimension (e.g., 'Focus on Prayer')
   */
  title: string;
  surveyIndices: SurveyLetter_surveyLetter_survey_surveyDimensions_surveyIndices[];
}

export interface SurveyLetter_surveyLetter_survey {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
  /**
   * When this survey was imported from Qualtrics
   */
  importedDate: any | null;
  /**
   * Dimensions for this survey; groups indices, which group items.
   */
  surveyDimensions: SurveyLetter_surveyLetter_survey_surveyDimensions[];
}

export interface SurveyLetter_surveyLetter_letter_letterElements_letterElementType {
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

export interface SurveyLetter_surveyLetter_letter_letterElements_image {
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

export interface SurveyLetter_surveyLetter_letter_letterElements_surveyDimension {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Title of this dimension (e.g., 'Focus on Prayer')
   */
  title: string;
}

export interface SurveyLetter_surveyLetter_letter_letterElements {
  /**
   * Unique ID for this entity
   */
  id: number;
  letterElementType: SurveyLetter_surveyLetter_letter_letterElements_letterElementType;
  /**
   * sequence number
   */
  sequence: number;
  /**
   * Quill text delta
   */
  textDelta: string | null;
  image: SurveyLetter_surveyLetter_letter_letterElements_image | null;
  surveyDimension: SurveyLetter_surveyLetter_letter_letterElements_surveyDimension | null;
}

export interface SurveyLetter_surveyLetter_letter {
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
   * Elements that make up this letter
   */
  letterElements: SurveyLetter_surveyLetter_letter_letterElements[];
}

export interface SurveyLetter_surveyLetter_letterType {
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
}

export interface SurveyLetter_surveyLetter {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * The survey
   */
  survey: SurveyLetter_surveyLetter_survey;
  /**
   * The letter
   */
  letter: SurveyLetter_surveyLetter_letter;
  /**
   * The letter type
   */
  letterType: SurveyLetter_surveyLetter_letterType;
}

export interface SurveyLetter {
  /**
   * Retrieve one survey letter
   */
  surveyLetter: SurveyLetter_surveyLetter;
}

export interface SurveyLetterVariables {
  id: number;
}
