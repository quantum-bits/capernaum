/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllGroupTypes
// ====================================================

export interface AllGroupTypes_groupTypes {
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

export interface AllGroupTypes {
  groupTypes: AllGroupTypes_groupTypes[];
}
