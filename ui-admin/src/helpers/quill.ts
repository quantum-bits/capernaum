import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

export function quillDeltaToHtml(deltaString: string): string {
  let delta = JSON.parse(deltaString);

  // https://eslint.org/docs/rules/no-prototype-builtins
  if (Object.prototype.hasOwnProperty.call(delta, "ops")) {
    // Deltas in the database are string-encoded objects with an `ops` property.
    delta = delta.ops;
  }
  const cfg = {};
  const converter = new QuillDeltaToHtmlConverter(delta, cfg);
  return converter.convert();
}
