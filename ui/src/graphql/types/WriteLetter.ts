/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LetterWriterInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: WriteLetter
// ====================================================

export interface WriteLetter_writeLetter {
  ok: boolean;
  pdfFilePath: string;
}

export interface WriteLetter {
  writeLetter: WriteLetter_writeLetter;
}

export interface WriteLetterVariables {
  letterWriterInput: LetterWriterInput;
}
