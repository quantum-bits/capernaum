import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import * as htmlToText from "html-to-text";

export function quillDeltaToHtml(deltaString: string) {
  let delta = JSON.parse(deltaString);
  if (delta.hasOwnProperty("ops")) {
    // Deltas in the database are string-encoded objects with an `ops` property.
    delta = delta.ops;
  }
  const cfg = {};
  const converter = new QuillDeltaToHtmlConverter(delta, cfg);
  return converter.convert();
}

export function quillHtmlToText(quillHtml: string) {
  return htmlToText.fromString(quillHtml);
}
