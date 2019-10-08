/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { QualtricsImportInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ImportQualtricsSurvey
// ====================================================

export interface ImportQualtricsSurvey_importQualtricsSurvey_surveyItems {
  /**
   * Text of this question from Qualtrics
   */
  qualtricsText: string;
}

export interface ImportQualtricsSurvey_importQualtricsSurvey {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Title for this survey in Capernaum
   */
  title: string;
  /**
   * Retrieve survey items; pass `whichItems` to choose which to return (default `All`)
   */
  surveyItems: ImportQualtricsSurvey_importQualtricsSurvey_surveyItems[];
}

export interface ImportQualtricsSurvey {
  /**
   * Import a survey from Qualtrics. Always use this to create a Capernaum survey.
   */
  importQualtricsSurvey: ImportQualtricsSurvey_importQualtricsSurvey;
}

export interface ImportQualtricsSurveyVariables {
  qualtricsImportInput: QualtricsImportInput;
}
