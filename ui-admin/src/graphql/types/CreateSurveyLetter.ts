/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SurveyLetterCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateSurveyLetter
// ====================================================

export interface CreateSurveyLetter_createSurveyLetter_letter_letterElements {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface CreateSurveyLetter_createSurveyLetter_letter {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Date created
   */
  created: any;
  /**
   * Description of letter
   */
  description: string;
  /**
   * Elements that make up this letter
   */
  letterElements: CreateSurveyLetter_createSurveyLetter_letter_letterElements[];
}

export interface CreateSurveyLetter_createSurveyLetter_letterType {
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

export interface CreateSurveyLetter_createSurveyLetter_survey {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
}

export interface CreateSurveyLetter_createSurveyLetter {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * The letter
   */
  letter: CreateSurveyLetter_createSurveyLetter_letter;
  /**
   * The letter type
   */
  letterType: CreateSurveyLetter_createSurveyLetter_letterType;
  /**
   * The survey
   */
  survey: CreateSurveyLetter_createSurveyLetter_survey;
}

export interface CreateSurveyLetter {
  /**
   * Create a new surveyLetter
   */
  createSurveyLetter: CreateSurveyLetter_createSurveyLetter;
}

export interface CreateSurveyLetterVariables {
  input: SurveyLetterCreateInput;
}
