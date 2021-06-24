/* tslint:disable */
/* eslint-disable */
// @generated
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
  /**
   * event type
   */
  type: string;
  /**
   * event details
   */
  details: string;
}

export interface AllEvents {
  events: AllEvents_events[];
}
