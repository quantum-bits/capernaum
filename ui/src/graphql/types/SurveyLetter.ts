/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SurveyLetter
// ====================================================

export interface SurveyLetter_surveyLetter_survey {
  __typename: "Survey";
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
}

export interface SurveyLetter_surveyLetter_letter_elements_letterElementType {
  __typename: "LetterElementType";
  key: string;
  description: string;
}

export interface SurveyLetter_surveyLetter_letter_elements {
  __typename: "LetterElement";
  /**
   * Unique ID for this entity
   */
  id: number;
  sequence: number;
  letterElementType: SurveyLetter_surveyLetter_letter_elements_letterElementType;
  textDelta: string | null;
}

export interface SurveyLetter_surveyLetter_letter {
  __typename: "Letter";
  name: string;
  updated: any;
  elements: SurveyLetter_surveyLetter_letter_elements[];
}

export interface SurveyLetter_surveyLetter {
  __typename: "SurveyLetter";
  /**
   * Unique ID for this entity
   */
  id: number;
  survey: SurveyLetter_surveyLetter_survey;
  letter: SurveyLetter_surveyLetter_letter;
  isActive: boolean;
  isFrozen: boolean;
}

export interface SurveyLetter {
  surveyLetter: SurveyLetter_surveyLetter;
}

export interface SurveyLetterVariables {
  id: number;
}
