/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SurveyLetters
// ====================================================

export interface SurveyLetters_surveyLetters_survey_surveyDimensions_surveyIndices {
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

export interface SurveyLetters_surveyLetters_survey_surveyDimensions {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Title of this dimension (e.g., 'Focus on Prayer')
   */
  title: string;
  surveyIndices: SurveyLetters_surveyLetters_survey_surveyDimensions_surveyIndices[];
}

export interface SurveyLetters_surveyLetters_survey {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
  /**
   * Dimensions for this survey; groups indices, which group items.
   */
  surveyDimensions: SurveyLetters_surveyLetters_survey_surveyDimensions[];
}

export interface SurveyLetters_surveyLetters_letter_letterElements_letterElementType {
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

export interface SurveyLetters_surveyLetters_letter_letterElements_image {
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

export interface SurveyLetters_surveyLetters_letter_letterElements_surveyDimension {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Title of this dimension (e.g., 'Focus on Prayer')
   */
  title: string;
}

export interface SurveyLetters_surveyLetters_letter_letterElements {
  /**
   * Unique ID for this entity
   */
  id: number;
  letterElementType: SurveyLetters_surveyLetters_letter_letterElements_letterElementType;
  /**
   * sequence number
   */
  sequence: number;
  /**
   * Quill text delta
   */
  textDelta: string | null;
  image: SurveyLetters_surveyLetters_letter_letterElements_image | null;
  surveyDimension: SurveyLetters_surveyLetters_letter_letterElements_surveyDimension | null;
}

export interface SurveyLetters_surveyLetters_letter {
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
  letterElements: SurveyLetters_surveyLetters_letter_letterElements[];
}

export interface SurveyLetters_surveyLetters_letterType {
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

export interface SurveyLetters_surveyLetters {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * The survey
   */
  survey: SurveyLetters_surveyLetters_survey;
  /**
   * The letter
   */
  letter: SurveyLetters_surveyLetters_letter;
  /**
   * The letter type
   */
  letterType: SurveyLetters_surveyLetters_letterType;
}

export interface SurveyLetters {
  /**
   * Retrieve all survey letters
   */
  surveyLetters: SurveyLetters_surveyLetters[];
}

export interface SurveyLettersVariables {
  id?: number | null;
}
