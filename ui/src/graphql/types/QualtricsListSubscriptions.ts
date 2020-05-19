/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QualtricsListSubscriptions
// ====================================================

export interface QualtricsListSubscriptions_subscriptions {
  id: string;
  topics: string;
  publicationUrl: string;
  successfulCalls: number;
  encrypted: boolean;
  scope: string;
}

export interface QualtricsListSubscriptions {
  subscriptions: QualtricsListSubscriptions_subscriptions[];
}
