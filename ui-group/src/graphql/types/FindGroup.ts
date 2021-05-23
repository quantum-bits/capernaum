/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FindGroup
// ====================================================

export interface FindGroup_findGroupByCodeWord {
  /**
   * Group name
   */
  name: string;
  /**
   * Group administrator first name
   */
  adminFirstName: string;
  /**
   * Group administrator last name
   */
  adminLastName: string;
}

export interface FindGroup {
  findGroupByCodeWord: FindGroup_findGroupByCodeWord | null;
}

export interface FindGroupVariables {
  codeWord: string;
}
