/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * Which items to retrieve: all, those with an index, those without an index
 */
export enum WhichItems {
  All = "All",
  WithIndex = "WithIndex",
  WithoutIndex = "WithoutIndex",
}

export interface ChangePasswordInput {
  userId: number;
  currentPassword: string;
  newPassword: string;
}

export interface GroupCreateInput {
  name: string;
  type: string;
  closedAfter: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  codeWord: string;
  surveyId: number;
}

export interface GroupUpdateInput {
  id: number;
  name?: string | null;
  type?: string | null;
  closedAfter?: string | null;
  adminFirstName?: string | null;
  adminLastName?: string | null;
  adminEmail?: string | null;
  codeWord?: string | null;
  surveyId?: number | null;
}

export interface ImageUpdateInput {
  id: number;
  title: string;
}

export interface LetterCreateInput {
  title: string;
  description: string;
  emailMessage: string;
  isFrozen?: boolean | null;
  surveyId: number;
  letterTypeId: number;
}

export interface LetterElementCreateInput {
  sequence: number;
  textDelta?: string | null;
  imageId?: number | null;
  letterId: number;
  letterElementTypeId: number;
  surveyDimensionId?: number | null;
}

export interface LetterElementUpdateInput {
  id: number;
  sequence?: number | null;
  textDelta?: string | null;
  imageId?: number | null;
  letterElementTypeId?: number | null;
  surveyDimensionId?: number | null;
}

export interface LetterUpdateInput {
  id: number;
  title?: string | null;
  description?: string | null;
  emailMessage?: string | null;
  isFrozen?: boolean | null;
  surveyId?: number | null;
  letterTypeId?: number | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface MachineCreateInput {
  name: string;
  hostName: string;
  active: boolean;
}

export interface PartialPredictionTableEntry {
  surveyIndexId: number;
  practiceId: number;
  sequence: number;
}

export interface PredictionTableEntryReplaceInput {
  letterId: number;
  entries: PartialPredictionTableEntry[];
}

export interface QualtricsSubscriptionCreateInput {
  hostName: string;
  subscriptionType: string;
  surveyId?: string | null;
}

export interface ScriptureEngagementPracticeCreateInput {
  title: string;
  description: string;
  moreInfoUrl: string;
  sequence: number;
}

export interface ScriptureEngagementPracticeUpdateInput {
  id: number;
  title?: string | null;
  description?: string | null;
  moreInfoUrl?: string | null;
  sequence?: number | null;
}

export interface SendMailInput {
  from?: string | null;
  to: string;
  subject: string;
  textContent: string;
  htmlContent?: string | null;
  attachmentPath?: string | null;
}

/**
 * Data to create a new dimension. Does not embed indices. Add them with createSurveyIndex.
 */
export interface SurveyDimensionCreateInput {
  surveyId: number;
  title: string;
  sequence: number;
}

export interface SurveyDimensionUpdateInput {
  id: number;
  title?: string | null;
  sequence?: number | null;
}

export interface SurveyIndexCreateInput {
  surveyDimensionId: number;
  itemIds: number[];
  abbreviation: string;
  title: string;
  useForPredictions: boolean;
}

export interface SurveyIndexUpdateInput {
  id: number;
  itemIds?: number[] | null;
  abbreviation?: string | null;
  title?: string | null;
  useForPredictions?: boolean | null;
}

export interface SurveyUpdateInput {
  id: number;
  qualtricsId?: string | null;
  qualtricsName?: string | null;
  qualtricsModDate?: string | null;
  emailKey?: string | null;
  groupCodeKey?: string | null;
  okayForGroup?: boolean | null;
  publicName?: string | null;
  detailedDescription?: string | null;
}

export interface UserUpdateInput {
  id: number;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  userRoleIds?: number[] | null;
}

export interface WriterInput {
  letterId: number;
  surveyResponseId: number;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
