/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllEvents
// ====================================================

export interface AllEvents_events {
  /**
   * Unique ID for this entity
   */
  id: number;
  date: string;
  type: string;
  details: string;
}

export interface AllEvents {
  events: AllEvents_events[];
}
