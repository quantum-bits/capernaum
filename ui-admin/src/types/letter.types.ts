import { Survey } from "./survey.types";

/** Types of elements that can appear in a letter; these come back from the db
 */
export interface LetterElementType {
  key: string; // e.g., "boilerplate"
  description: string; // e.g., "Boilerplate Text"
}

/** Letter elements (e.g., boilerplate, spiritual focus chart, etc.)
 */
export interface LetterElement {
  id: number; // id in the database
  sequence: number; // order of this text item (paragraph) within the letter (0, 1,....)
  key: string; // e.g., "boilerplate", "spiritual-focus-chart", etc. (see LetterElement enum)
  textDelta: string; // Quill Delta object containing the text
  isNew?: boolean; // is not yet in the db (useful information for the form)
  editModeOn?: boolean; // are we editing this item at the moment? useful in the form
}

export interface ScriptureEngagementPractice {
  title: string;
  description: string;
  sequence: number;
}

export interface Letter {
  name: string;
  created: string;
  updated: string;
  elements: LetterElement[];
}

export interface SurveyLetter {
  survey: Survey;
  letter: Letter;
  isActive: boolean;
}

/** related enum
 */
export enum LetterElementEnum {
  BOILERPLATE = "boilerplate",
  CHART = "chart",
  BOOLEAN_CALCULATION_RESULTS = "boolean-calculation-results",
  IMAGE = "image",
  DEMOGRAPHICS_CHART = "demographics-chart",
}

/**
 * enum for type of letter
 */
export enum LetterTypeEnum {
  INDIVIDUAL = "INDIVIDUAL",
  GROUP = "GROUP",
}
