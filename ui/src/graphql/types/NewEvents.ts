/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: NewEvents
// ====================================================

export interface NewEvents_newEvent {
  date: string;
  /**
   * Unique ID for this entity
   */
  id: number;
  type: string;
  details: string;
}

export interface NewEvents {
  newEvent: NewEvents_newEvent;
}
