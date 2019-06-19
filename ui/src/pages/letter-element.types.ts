/** types of elements that can appear in a letter; these come back from the db
 */
export interface LetterElementItemType {
    key: string; // e.g., "boilerplate"
    description: string; // e.g., "Boilerplate Text"
}

/** related enum
 */
export enum LetterElementEnum {
    BOILERPLATE = "boilerplate",
    SPIRITUAL_FOCUS_CHART = "spiritual-focus-chart",
    SPIRITUAL_ORIENTATIONS_CHART = "spiritual-orientations-chart",
    BOOLEAN_CALCULATION_RESULTS= "boolean-calculation-results"
}
