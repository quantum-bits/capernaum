import * as _ from "lodash";

/**
 * Truncate input to a maximum number of words
 * @param value raw input
 * @param maxLength max length
 */
export function truncateWords(value: string, maxLength = 10): string {
  const words = _.split(value, /\s+/);
  return _.take(words, _.min([words.length, maxLength])).join(" ");
}

/**
 * Quick-and-dirty function to strip out HTML tags.
 * Tried using the `html-to-text` package, but it doesn't play nice on the browser side.
 * @param value String containing HTML tags
 */
export function stripHtmlTags(value: string): string {
  return value.replace(/<.*?>/g, " ").replace(/\s+/g, " ").trim();
}
