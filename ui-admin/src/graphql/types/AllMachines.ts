/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllMachines
// ====================================================

export interface AllMachines_machines {
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

export interface AllMachines {
  machines: AllMachines_machines[];
}
