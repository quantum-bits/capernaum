/* tslint:disable */
/* eslint-disable */
// @generated
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
  predictionTableEntries: ScriptureEngagementPractices_scriptureEngagementPractices_predictionTableEntries[];
}

export interface ScriptureEngagementPractices {
  scriptureEngagementPractices: ScriptureEngagementPractices_scriptureEngagementPractices[];
}
