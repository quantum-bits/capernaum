/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ScriptureEngagementPractices
// ====================================================

export interface ScriptureEngagementPractices_scriptureEngagementPractices_surveyIndices {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Title of this index
   */
  title: string;
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
   * URL for more information on practice
   */
  moreInfoUrl: string;
  /**
   * Survey indices for this SEP
   */
  surveyIndices: ScriptureEngagementPractices_scriptureEngagementPractices_surveyIndices[];
}

export interface ScriptureEngagementPractices {
  scriptureEngagementPractices: ScriptureEngagementPractices_scriptureEngagementPractices[];
}
