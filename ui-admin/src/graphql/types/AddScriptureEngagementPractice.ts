/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ScriptureEngagementPracticeCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddScriptureEngagementPractice
// ====================================================

export interface AddScriptureEngagementPractice_createScriptureEngagementPractice {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Practice title
   */
  title: string;
  /**
   * Description of this practice
   */
  description: string;
  /**
   * URL for more information on practice
   */
  moreInfoUrl: string;
}

export interface AddScriptureEngagementPractice {
  /**
   * Create a scripture engagement practice
   */
  createScriptureEngagementPractice: AddScriptureEngagementPractice_createScriptureEngagementPractice;
}

export interface AddScriptureEngagementPracticeVariables {
  createInput: ScriptureEngagementPracticeCreateInput;
}
