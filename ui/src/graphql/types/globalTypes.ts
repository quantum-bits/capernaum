/* tslint:disable */
/* eslint-disable */
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
}

export interface LetterWriterInput {
  letterId: number;
  surveyResponseId: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
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

export interface QualtricsImportInput {
  qualtricsId: string;
  title: string;
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

export interface UserUpdateInput {
  id: number;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  userRoleIds?: number[] | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
