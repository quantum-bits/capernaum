/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { QualtricsSubscriptionCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateSubscription
// ====================================================

export interface CreateSubscription_createSubscription {
  id: string;
  scope: string;
  topics: string;
  publicationUrl: string;
  encrypted: boolean;
  successfulCalls: number;
}

export interface CreateSubscription {
  createSubscription: CreateSubscription_createSubscription;
}

export interface CreateSubscriptionVariables {
  createInput: QualtricsSubscriptionCreateInput;
}
