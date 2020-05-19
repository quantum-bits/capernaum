/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ScriptureEngagementPracticeUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateScriptureEngagementPractice
// ====================================================

export interface UpdateScriptureEngagementPractice_updateScriptureEngagementPractice {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  description: string;
  sequence: number;
  moreInfoUrl: string;
}

export interface UpdateScriptureEngagementPractice {
  updateScriptureEngagementPractice: UpdateScriptureEngagementPractice_updateScriptureEngagementPractice;
}

export interface UpdateScriptureEngagementPracticeVariables {
  updateData: ScriptureEngagementPracticeUpdateInput;
}
