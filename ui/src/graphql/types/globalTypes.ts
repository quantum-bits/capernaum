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

export interface LetterCreateInput {
  title: string;
  description: string;
  isFrozen?: boolean | null;
  surveyId: number;
}

export interface LetterUpdateInput {
  id: number;
  title?: string | null;
  description?: string | null;
  isFrozen?: boolean | null;
  surveyId: number;
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

//==============================================================
// END Enums and Input Objects
//==============================================================
