import { JSONContent } from "@tiptap/vue-2";

export function emptyTipTapDocument(): JSONContent {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
      },
    ],
  };
}

export function isTipTapJsonString(deltaString: string): boolean {
  return deltaString.match(/^{"type"/) !== null;
}
