/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GroupResponses
// ====================================================

export interface GroupResponses_groupResponses_survey_letters_letterType {
  /**
   * Unique ID for this entity
   */
  id: number;
  key: string;
  description: string;
}

export interface GroupResponses_groupResponses_survey_letters {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  description: string;
  emailMessage: string;
  letterType: GroupResponses_groupResponses_survey_letters_letterType;
}

export interface GroupResponses_groupResponses_survey {
  /**
   * Unique identifier for this survey on Qualtrics
   */
  qualtricsId: string;
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
  /**
   * Fetch the letters for this survey
   */
  letters: GroupResponses_groupResponses_survey_letters[];
}

export interface GroupResponses_groupResponses {
  /**
   * Unique ID for this entity
   */
  id: number;
  qualtricsResponseId: string;
  /**
   * Respondent's email address
   */
  email: string;
  survey: GroupResponses_groupResponses_survey;
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

export interface GroupResponses {
  groupResponses: GroupResponses_groupResponses[];
}

export interface GroupResponsesVariables {
  groupId: number;
}
