/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllSurveys
// ====================================================

export interface AllSurveys_surveys {
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
   * Public name for survey (e.g., in group sign-up)
   */
  publicName: string;
  /**
   * Detailed description of this survey; mostly for group use
   */
  detailedDescription: string;
}

export interface AllSurveys {
  surveys: AllSurveys_surveys[];
}
