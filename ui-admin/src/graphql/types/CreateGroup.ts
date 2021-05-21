/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GroupCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateGroup
// ====================================================

export interface CreateGroup_newGroup {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface CreateGroup {
  newGroup: CreateGroup_newGroup;
}

export interface CreateGroupVariables {
  createInput: GroupCreateInput;
}
