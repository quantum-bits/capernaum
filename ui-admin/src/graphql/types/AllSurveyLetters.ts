/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllSurveyLetters
// ====================================================

export interface AllSurveyLetters_surveyLetters_survey {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
}

export interface AllSurveyLetters_surveyLetters_letter_letterElements {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface AllSurveyLetters_surveyLetters_letter {
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
  letterElements: AllSurveyLetters_surveyLetters_letter_letterElements[];
}

export interface AllSurveyLetters_surveyLetters_letterType {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Letter type name
   */
  key: string;
}

export interface AllSurveyLetters_surveyLetters {
  survey: AllSurveyLetters_surveyLetters_survey;
  letter: AllSurveyLetters_surveyLetters_letter;
  letterType: AllSurveyLetters_surveyLetters_letterType;
}

export interface AllSurveyLetters {
  /**
   * Retrieve all survey letters
   */
  surveyLetters: AllSurveyLetters_surveyLetters[];
}
