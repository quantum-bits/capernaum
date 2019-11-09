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
  letterId: number;
  sequence: number;
  letterElementTypeId: number;
  textDelta?: string | null;
  surveyDimensionId?: number | null;
}

export interface LetterElementUpdateInput {
  id: number;
  sequence?: number | null;
  letterElementTypeId?: number | null;
  textDelta?: string | null;
  surveyDimensionId?: number | null;
}

export interface LetterUpdateInput {
  id: number;
  title?: string | null;
  description?: string | null;
  emailMessage?: string | null;
  isFrozen?: boolean | null;
  surveyId: number;
}

export interface LetterWriterInput {
  letterId: number;
  surveyResponseId: number;
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

//==============================================================
// END Enums and Input Objects
//==============================================================
