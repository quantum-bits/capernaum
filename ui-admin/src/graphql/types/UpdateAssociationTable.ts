/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AssociationUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateAssociationTable
// ====================================================

export interface UpdateAssociationTable_updateBooleanAssociations_scriptureEngagementPractices {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Practice title
   */
  title: string;
}

export interface UpdateAssociationTable_updateBooleanAssociations {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Title of this index
   */
  title: string;
  /**
   * Practices predicted by this index
   */
  scriptureEngagementPractices: UpdateAssociationTable_updateBooleanAssociations_scriptureEngagementPractices[];
}

export interface UpdateAssociationTable {
  /**
   * Make changes to SE practice associations; returns updated indices
   */
  updateBooleanAssociations: UpdateAssociationTable_updateBooleanAssociations[];
}

export interface UpdateAssociationTableVariables {
  updates: AssociationUpdateInput[];
}
