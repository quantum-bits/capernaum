/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllGroups
// ====================================================

export interface AllGroups_allGroups_type {
  id: number;
  /**
   * Group name (e.g., 'Small Group')
   */
  name: string;
  /**
   * Group code (e.g., 'SMALL_GROUP')
   */
  code: string;
}

export interface AllGroups_allGroups_survey {
  /**
   * Unique identifier for this survey on Qualtrics
   */
  qualtricsId: string;
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
}

export interface AllGroups_allGroups {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Group name
   */
  name: string;
  type: AllGroups_allGroups_type;
  /**
   * Survey code word used by group
   */
  codeWord: string;
  survey: AllGroups_allGroups_survey;
}

export interface AllGroups {
  allGroups: AllGroups_allGroups[];
}
