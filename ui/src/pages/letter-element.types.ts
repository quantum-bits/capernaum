/** types of elements that can appear in a letter; these come back from the db
 */
export interface LetterElementMenuItemType {
  key: string; // e.g., "boilerplate"
  description: string; // e.g., "Boilerplate Text"
}

/** letter elements (e.g., boilerplate, spiritual focus chart, etc.)
 */
export interface LetterElementType {
  id: number; // id in the database
  order: number; // order of this text item (paragraph) within the letter (0, 1,....)
  key: string; // e.g., "boilerplate", "spiritual-focus-chart", etc. (see LetterElement enum)
  textDelta: any; // Quill Delta object containing the text
  isNew?: boolean; // is not yet in the db (useful information for the form)
  editModeOn?: boolean; // are we editing this item at the moment? useful in the form
}

/** related enum
 */
export enum LetterElementEnum {
  BOILERPLATE = "boilerplate",
  SPIRITUAL_FOCUS_CHART = "spiritual-focus-chart",
  SPIRITUAL_ORIENTATIONS_CHART = "spiritual-orientations-chart",
  BOOLEAN_CALCULATION_RESULTS = "boolean-calculation-results"
}
