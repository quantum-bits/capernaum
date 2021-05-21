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
  name: string;
  hostName: string;
  active: boolean;
}

export interface CreateMachine {
  createMachine: CreateMachine_createMachine;
}

export interface CreateMachineVariables {
  createInput: MachineCreateInput;
}
