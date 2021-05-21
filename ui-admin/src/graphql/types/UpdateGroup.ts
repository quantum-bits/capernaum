/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GroupUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateGroup
// ====================================================

export interface UpdateGroup_updatedGroup {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface UpdateGroup {
  updatedGroup: UpdateGroup_updatedGroup;
}

export interface UpdateGroupVariables {
  updateInput: GroupUpdateInput;
}
