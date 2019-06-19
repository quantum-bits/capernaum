/** text box item (paragraph) in a letter.
 */
export interface TextBoxItemType {
    id: number; // id in the database
    order: number; // order of this text item (paragraph) within the letter (0, 1,....)
    key: string; // e.g., "boilerplate", "spiritual-focus-chart", etc. (see LetterElement enum)
    text: string; // the paragraph itself, rich-text formatted as html
    isNew?: boolean; // is not yet in the db (useful information for the form)
    editModeOn?: boolean; // are we editing this item at the moment? useful in the form 
}
