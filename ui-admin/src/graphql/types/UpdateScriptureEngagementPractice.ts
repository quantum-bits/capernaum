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
  /**
   * Practice title
   */
  title: string;
  /**
   * Description of this practice
   */
  description: string;
  /**
   * Sequence number
   */
  sequence: number;
  /**
   * URL for more information on practice
   */
  moreInfoUrl: string;
}

export interface UpdateScriptureEngagementPractice {
  updateScriptureEngagementPractice: UpdateScriptureEngagementPractice_updateScriptureEngagementPractice;
}

export interface UpdateScriptureEngagementPracticeVariables {
  updateData: ScriptureEngagementPracticeUpdateInput;
}
