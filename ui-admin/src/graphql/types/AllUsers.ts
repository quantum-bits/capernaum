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
  /**
   * Role name
   */
  name: string;
}

export interface AllUsers_users {
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
  roles: AllUsers_users_roles[];
}

export interface AllUsers {
  users: AllUsers_users[];
}
