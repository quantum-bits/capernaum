/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GroupCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddGroup
// ====================================================

export interface AddGroup_createGroup_type {
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

export interface AddGroup_createGroup_survey {
  /**
   * Public name for survey (e.g., in group sign-up)
   */
  publicName: string;
  /**
   * Name of this survey on Qualtrics
   */
  qualtricsName: string;
  /**
   * Detailed description of this survey; mostly for group use
   */
  detailedDescription: string;
}

export interface AddGroup_createGroup {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Group name
   */
  name: string;
  type: AddGroup_createGroup_type;
  /**
   * Survey code word used by group
   */
  codeWord: string;
  survey: AddGroup_createGroup_survey;
}

export interface AddGroup {
  createGroup: AddGroup_createGroup;
}

export interface AddGroupVariables {
  createInput: GroupCreateInput;
}
