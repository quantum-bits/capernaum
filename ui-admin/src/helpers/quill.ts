import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { generateJSON } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import { del } from "@vue/composition-api";

export function isQuillDeltaString(deltaString: string): boolean {
  return deltaString.match(/^{"ops"/) !== null;
}

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

export function quillDeltaToTipTapJson(
  deltaString: string
): Record<string, any> {
  console.log("deltaString", deltaString);

  const htmlString = quillDeltaToHtml(deltaString);
  console.log("htmlString", htmlString);

  const tipTapJson = generateJSON(htmlString, [StarterKit]);
  console.log("tipTapJson", tipTapJson);

  return tipTapJson;
}
