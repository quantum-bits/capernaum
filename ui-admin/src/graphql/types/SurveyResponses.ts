/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SurveyResponses
// ====================================================

export interface SurveyResponses_surveyResponses_survey_surveyLetters_letter {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface SurveyResponses_surveyResponses_survey_surveyLetters_letterType {
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

export interface SurveyResponses_surveyResponses_survey_surveyLetters {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * The letter
   */
  letter: SurveyResponses_surveyResponses_survey_surveyLetters_letter;
  /**
   * The letter type
   */
  letterType: SurveyResponses_surveyResponses_survey_surveyLetters_letterType;
}

export interface SurveyResponses_surveyResponses_survey {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Survey letters for this survey
   */
  surveyLetters: SurveyResponses_surveyResponses_survey_surveyLetters[];
}

export interface SurveyResponses_surveyResponses {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Qualtrics response ID (e.g., R_...)
   */
  qualtricsResponseId: string;
  /**
   * Respondent's email address
   */
  email: string;
  /**
   * When survey was started
   */
  startDate: string;
  /**
   * When survey was completed
   */
  endDate: string;
  /**
   * Percent complete
   */
  progress: number;
  /**
   * Time to complete (seconds)
   */
  duration: number;
  /**
   * 1 = Survey complete and submitted, 0 = otherwise
   */
  finished: number;
  /**
   * Respondent's latitude
   */
  latitude: string;
  /**
   * Respondent's longitude
   */
  longitude: string;
  /**
   * Survey for which this is a response
   */
  survey: SurveyResponses_surveyResponses_survey;
}

export interface SurveyResponses {
  surveyResponses: SurveyResponses_surveyResponses[];
}

export interface SurveyResponsesVariables {
  surveyId: number;
  groupId?: number | null;
}
