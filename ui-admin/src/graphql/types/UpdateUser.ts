/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateUser
// ====================================================

export interface UpdateUser_updateUser {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Email address
   */
  email: string;
  /**
   * First name
   */
  firstName: string;
  /**
   * Last name
   */
  lastName: string;
}

export interface UpdateUser {
  updateUser: UpdateUser_updateUser;
}

export interface UpdateUserVariables {
  updateInput: UserUpdateInput;
}
