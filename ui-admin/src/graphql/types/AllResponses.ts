/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllResponses
// ====================================================

export interface AllResponses_surveyResponses_survey_surveyLetters_letter {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Letter title
   */
  title: string;
  /**
   * Description of letter
   */
  description: string;
  /**
   * Email message to go out with letter
   */
  emailMessage: string;
}

export interface AllResponses_surveyResponses_survey_surveyLetters_letterType {
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

export interface AllResponses_surveyResponses_survey_surveyLetters {
  letter: AllResponses_surveyResponses_survey_surveyLetters_letter;
  letterType: AllResponses_surveyResponses_survey_surveyLetters_letterType;
}

export interface AllResponses_surveyResponses_survey {
  /**
   * Unique identifier for this survey on Qualtrics
   */
  qualtricsId: string;
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
  /**
   * Survey letters for this survey
   */
  surveyLetters: AllResponses_surveyResponses_survey_surveyLetters[];
}

export interface AllResponses_surveyResponses {
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
   * Survey for which this is a response
   */
  survey: AllResponses_surveyResponses_survey;
  /**
   * When survey was started
   */
  startDate: string;
  /**
   * When survey was completed
   */
  endDate: string;
  /**
   * Time to complete (seconds)
   */
  duration: number;
  /**
   * 1 = Survey complete and submitted, 0 = otherwise
   */
  finished: number;
}

export interface AllResponses {
  surveyResponses: AllResponses_surveyResponses[];
}
