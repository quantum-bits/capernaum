/* tslint:disable */
/* eslint-disable */
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
  title: string;
  description: string;
  sequence: number;
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
