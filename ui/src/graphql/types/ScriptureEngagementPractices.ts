/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ScriptureEngagementPractices
// ====================================================

export interface ScriptureEngagementPractices_scriptureEngagementPractices_predictionTableEntries {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface ScriptureEngagementPractices_scriptureEngagementPractices {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  description: string;
  sequence: number;
  moreInfoUrl: string;
  predictionTableEntries: ScriptureEngagementPractices_scriptureEngagementPractices_predictionTableEntries[];
}

export interface ScriptureEngagementPractices {
  scriptureEngagementPractices: ScriptureEngagementPractices_scriptureEngagementPractices[];
}
