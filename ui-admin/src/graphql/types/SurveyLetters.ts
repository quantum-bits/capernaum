/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SurveyLetters
// ====================================================

export interface SurveyLetters_surveyLetters_survey {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
}

export interface SurveyLetters_surveyLetters_letter_letterElements {
  /**
   * Unique ID for this entity
   */
  id: number;
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
