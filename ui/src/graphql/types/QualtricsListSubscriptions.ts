/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QualtricsListSubscriptions
// ====================================================

export interface QualtricsListSubscriptions_qualtricsListSubscriptions {
  id: string;
  topics: string;
  publicationUrl: string;
  successfulCalls: number;
  encrypted: boolean;
  scope: string;
}

export interface QualtricsListSubscriptions {
  qualtricsListSubscriptions: QualtricsListSubscriptions_qualtricsListSubscriptions[];
}
