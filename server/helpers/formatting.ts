import prettyFormat from "pretty-format";

export function printPretty(val: unknown) {
  console.log(prettyFormat(val));
}
