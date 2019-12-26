/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LetterWriterInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: WriteLetter
// ====================================================

export interface WriteLetter_writeLetter_responseSummary_surveySummary {
  id: number;
  title: string;
  qualtricsId: string;
  qualtricsName: string;
}

export interface WriteLetter_writeLetter_responseSummary_dimensionSummaries_indexSummaries_itemSummaries {
  id: number;
  qualtricsId: string;
  qualtricsText: string;
  responseId: number;
  responseLabel: string;
  responseValue: number;
}

export interface WriteLetter_writeLetter_responseSummary_dimensionSummaries_indexSummaries {
  id: number;
  title: string;
  abbreviation: string;
  meanResponse: number;
  itemSummaries: WriteLetter_writeLetter_responseSummary_dimensionSummaries_indexSummaries_itemSummaries[];
}

export interface WriteLetter_writeLetter_responseSummary_dimensionSummaries {
  id: number;
  title: string;
  indexSummaries: WriteLetter_writeLetter_responseSummary_dimensionSummaries_indexSummaries[];
}

export interface WriteLetter_writeLetter_responseSummary_predictionSummaries_practiceSummary {
  id: number;
  title: string;
}

export interface WriteLetter_writeLetter_responseSummary_predictionSummaries_predictionDetails {
  title: string;
  abbreviation: string;
  meanResponse: number;
}

export interface WriteLetter_writeLetter_responseSummary_predictionSummaries {
  practiceSummary: WriteLetter_writeLetter_responseSummary_predictionSummaries_practiceSummary;
  predictionDetails: WriteLetter_writeLetter_responseSummary_predictionSummaries_predictionDetails[];
  predict: boolean;
}

export interface WriteLetter_writeLetter_responseSummary {
  id: number;
  date: string;
  email: string;
  qualtricsResponseId: string;
  surveySummary: WriteLetter_writeLetter_responseSummary_surveySummary;
  dimensionSummaries: WriteLetter_writeLetter_responseSummary_dimensionSummaries[];
  predictionSummaries: WriteLetter_writeLetter_responseSummary_predictionSummaries[];
}

export interface WriteLetter_writeLetter {
  ok: boolean;
  pdfFilePath: string;
  responseSummary: WriteLetter_writeLetter_responseSummary;
}

export interface WriteLetter {
  writeLetter: WriteLetter_writeLetter;
}

export interface WriteLetterVariables {
  letterWriterInput: LetterWriterInput;
}
