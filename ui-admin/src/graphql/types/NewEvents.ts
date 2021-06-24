/* tslint:disable */
/* eslint-disable */
// @generated
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
  /**
   * event type
   */
  type: string;
  /**
   * event details
   */
  details: string;
}

export interface NewEvents {
  newEvent: NewEvents_newEvent;
}
