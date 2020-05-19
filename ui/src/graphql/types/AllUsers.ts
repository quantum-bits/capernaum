/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllUsers
// ====================================================

export interface AllUsers_users_roles {
  /**
   * Unique ID for this entity
   */
  id: number;
  name: string;
}

export interface AllUsers_users {
  /**
   * Unique ID for this entity
   */
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: AllUsers_users_roles[];
}

export interface AllUsers {
  users: AllUsers_users[];
}
