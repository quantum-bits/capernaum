/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllGroups
// ====================================================

export interface AllGroups_groups_type {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Group name (e.g., 'Small Group')
   */
  name: string;
  /**
   * Group code (e.g., 'small-group')
   */
  code: string;
}

export interface AllGroups_groups_survey {
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

export interface AllGroups_groups_surveyResponses {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Respondent's email address
   */
  email: string;
}

export interface AllGroups_groups {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Group name
   */
  name: string;
  type: AllGroups_groups_type;
  /**
   * Name for 'other' type 
   */
  otherTypeName: string | null;
  /**
   * Date when survey created
   */
  created: any;
  /**
   * Date when survey closes
   */
  closedAfter: any;
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
  survey: AllGroups_groups_survey;
  /**
   * Responses by this group
   */
  surveyResponses: AllGroups_groups_surveyResponses[] | null;
}

export interface AllGroups {
  groups: AllGroups_groups[];
}
