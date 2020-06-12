/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { WriterInput } from "./globalTypes";

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
  predictionDetails: WriteLetter_writeLetter_responseSummary_predictionSummaries_predictionDetails;
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
  /**
   * Message to UI
   */
  message: string;
  /**
   * Name of PDF file (e.g., 'abc.pdf')
   */
  pdfFileName: string;
  /**
   * Absolute path to PDF file (e.g., '/home/capernaum/static/pdfs/abc.pdf')
   */
  pdfAbsolutePath: string;
  /**
   * Relative path to PDF file (e.g., 'static/pdfs/abc.pdf')
   */
  pdfRelativePath: string;
  responseSummary: WriteLetter_writeLetter_responseSummary | null;
}

export interface WriteLetter {
  writeLetter: WriteLetter_writeLetter;
}

export interface WriteLetterVariables {
  writerInput: WriterInput;
}
