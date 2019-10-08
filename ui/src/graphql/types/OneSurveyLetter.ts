/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OneSurveyLetter
// ====================================================

export interface OneSurveyLetter_surveyLetter_survey {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
}

export interface OneSurveyLetter_surveyLetter_letter_elements_letterElementType {
  key: string;
  description: string;
}

export interface OneSurveyLetter_surveyLetter_letter_elements_textDelta_ops {
  insert: string | null;
}

export interface OneSurveyLetter_surveyLetter_letter_elements_textDelta {
  ops: OneSurveyLetter_surveyLetter_letter_elements_textDelta_ops[] | null;
}

export interface OneSurveyLetter_surveyLetter_letter_elements {
  /**
   * Unique ID for this entity
   */
  id: number;
  sequence: number;
  letterElementType: OneSurveyLetter_surveyLetter_letter_elements_letterElementType;
  textDelta: OneSurveyLetter_surveyLetter_letter_elements_textDelta | null;
}

export interface OneSurveyLetter_surveyLetter_letter {
  /**
   * Unique ID for this entity
   */
  id: number;
  name: string;
  updated: any;
  elements: OneSurveyLetter_surveyLetter_letter_elements[];
}

export interface OneSurveyLetter_surveyLetter {
  /**
   * Unique ID for this entity
   */
  id: number;
  survey: OneSurveyLetter_surveyLetter_survey;
  letter: OneSurveyLetter_surveyLetter_letter;
  isActive: boolean;
  isFrozen: boolean;
}

export interface OneSurveyLetter {
  surveyLetter: OneSurveyLetter_surveyLetter;
}

export interface OneSurveyLetterVariables {
  id: number;
}
