/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OneUser
// ====================================================

export interface OneUser_user_roles {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Role name
   */
  name: string;
}

export interface OneUser_user {
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
  roles: OneUser_user_roles[];
}

export interface OneUser {
  user: OneUser_user;
}

export interface OneUserVariables {
  userId: number;
}
