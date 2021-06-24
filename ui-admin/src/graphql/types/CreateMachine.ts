/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MachineCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateMachine
// ====================================================

export interface CreateMachine_createMachine {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Machine name
   */
  name: string;
  /**
   * Host name (e.g., FQDN)
   */
  hostName: string;
  /**
   * Is this machine active?
   */
  active: boolean;
}

export interface CreateMachine {
  createMachine: CreateMachine_createMachine;
}

export interface CreateMachineVariables {
  createInput: MachineCreateInput;
}
