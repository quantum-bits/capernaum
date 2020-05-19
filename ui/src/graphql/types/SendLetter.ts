/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SendMailInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SendLetter
// ====================================================

export interface SendLetter_sendLetter_envelope {
  from: string;
  to: string[];
}

export interface SendLetter_sendLetter {
  accepted: string[];
  rejected: string[];
  messageId: string;
  envelope: SendLetter_sendLetter_envelope;
}

export interface SendLetter {
  sendLetter: SendLetter_sendLetter;
}

export interface SendLetterVariables {
  mailInput: SendMailInput;
}
