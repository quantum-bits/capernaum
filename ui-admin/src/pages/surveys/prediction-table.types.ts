/**
 * similar to ScriptureEngagementPractice type, but used to display data in the vuetify table; the format is
 * not ideal, but is set up to conform to what is expected in the vuetify table structure
 */
export interface TableData {
  practice: string; // e.g., "Journaling"
  practiceId: number; // id for this SE practice in the db
  practiceOrder: number; // order in which to display this SE practice in the association table
  spiritualFocusOrientationIdDict: { [key: string]: boolean }; // key:value pairs of the of the form {"columnId-1": true, "columnId-2": false}, where columnId corresponds to a spiritual focus/orientation id
}

/**
 * type that specifies how Spiritual Foci/Orientations are returned from the db
 */
export interface SpiritualFocusOrientation {
  abbreviation: string; // e.g., "FOO"
  id: number; // id for this spiritual focus/orientation
  order: number; // order in which to list this spiritual focus/orientation
  title: string; // e.g., "Focus on Others"
}

/**
 * type vuetify table headers for the Association Table
 */
export interface AssociationTableHeader {
  align: string; // e.g., "left"
  sortable: boolean; // whether or not the column is sortable
  text: string; // text for the column
  value: string; // "practice" for the first column; "columnId-id" for the rest, where id is the id of the spiritual focus/orientation in the db
}
