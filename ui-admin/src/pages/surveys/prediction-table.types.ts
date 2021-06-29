/**
 * Vuetify table headers for the Association Table
 */

/**
 * similar to ScriptureEngagementPractice type, but used to display data in the vuetify table; the format is
 * not ideal, but is set up to conform to what is expected in the vuetify table structure
 */


/**
 * How Spiritual Foci/Orientations are returned from the db
 */
export interface SpiritualFocusOrientation {
  id: number; // id for this spiritual focus/orientation
  title: string; // e.g., "Focus on Others"
  abbreviation: string; // e.g., "FOO"
  order: number; // order in which to list this spiritual focus/orientation
}
