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
   * Key of response value containing email address
   */
  emailKey: string;
  /**
   * Key of response value containing group code
   */
  groupCodeKey: string;
  /**
   * Make this survey available to groups?
   */
  okayForGroup: boolean;
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
   * Date when survey created
   */
  created: string;
  /**
   * Date when survey closes
   */
  closedAfter: string;
  /**
   * Group administrator first name
   */
  adminFirstName: string;
  /**
   * Group administrator last name
   */
  adminLastName: string;
  /**
   * Group administrator email address
   */
  adminEmail: string;
  /**
   * Survey code word used by group
   */
  codeWord: string;
  survey: AllGroups_allGroups_survey;
}

export interface AllGroups {
  allGroups: AllGroups_allGroups[];
}
