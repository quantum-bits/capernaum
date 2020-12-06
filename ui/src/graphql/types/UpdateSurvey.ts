/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SurveyUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateSurvey
// ====================================================

export interface UpdateSurvey_updateSurvey_letters_letterType {
  /**
   * Unique ID for this entity
   */
  id: number;
  key: string;
  description: string;
}

export interface UpdateSurvey_updateSurvey_letters {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  letterType: UpdateSurvey_updateSurvey_letters_letterType;
}

export interface UpdateSurvey_updateSurvey_surveyDimensions {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface UpdateSurvey_updateSurvey_surveyItems {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface UpdateSurvey_updateSurvey_surveyResponses {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface UpdateSurvey_updateSurvey {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Unique identifier for this survey on Qualtrics
   */
  qualtricsId: string;
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
  /**
   * Date and time at which this survey was modified on Qualtrics
   */
  qualtricsModDate: string;
  /**
   * Make this survey available to groups?
   */
  okayForGroup: boolean;
  /**
   * Detailed description of this survey; mostly for group use
   */
  detailedDescription: string;
  /**
   * Fetch the letters for this survey
   */
  letters: UpdateSurvey_updateSurvey_letters[];
  /**
   * Dimensions for this survey; groups indices, which group items.
   */
  surveyDimensions: UpdateSurvey_updateSurvey_surveyDimensions[];
  /**
   * All the Qualtrics items for this survey; 
   *     for groupings, see survey dimension and index.
   *     Pass 'whichItems' to choose which to return (default 'All')
   */
  surveyItems: UpdateSurvey_updateSurvey_surveyItems[];
  /**
   * Responses for this survey
   */
  surveyResponses: UpdateSurvey_updateSurvey_surveyResponses[];
}

export interface UpdateSurvey {
  updateSurvey: UpdateSurvey_updateSurvey;
}

export interface UpdateSurveyVariables {
  updateInput: SurveyUpdateInput;
}
