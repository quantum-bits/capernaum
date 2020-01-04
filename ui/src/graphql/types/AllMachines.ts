/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllMachines
// ====================================================

export interface AllMachines_machines {
  /**
   * Unique ID for this entity
   */
  id: number;
  name: string;
  hostName: string;
  active: boolean;
}

export interface AllMachines {
  machines: AllMachines_machines[];
}
