/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LoginCredentials } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: Login
// ====================================================

export interface Login_login_user_roles {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Role name
   */
  name: string;
  /**
   * Role description
   */
  description: string;
}

export interface Login_login_user {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: Login_login_user_roles[];
}

export interface Login_login {
  accessToken: string;
  user: Login_login_user;
}

export interface Login {
  login: Login_login;
}

export interface LoginVariables {
  credentials: LoginCredentials;
}
