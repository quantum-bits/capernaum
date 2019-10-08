/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SurveyLetters
// ====================================================

export interface SurveyLetters_surveyLetters_survey {
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
}

export interface SurveyLetters_surveyLetters_letter {
  name: string;
  updated: any;
}

export interface SurveyLetters_surveyLetters {
  /**
   * Unique ID for this entity
   */
  id: number;
  survey: SurveyLetters_surveyLetters_survey;
  letter: SurveyLetters_surveyLetters_letter;
  isActive: boolean;
  isFrozen: boolean;
}

export interface SurveyLetters {
  surveyLetters: SurveyLetters_surveyLetters[];
}
