import { printTable } from "@helpers/formatting";
import * as _ from "lodash";

function truncate(str, maxLength = 80) {
  return str.trim().substring(0, maxLength);
}

export function dumpEnv() {
  const headers = ["Key", "Value"];
  const data = _.toPairs(process.env)
    .map((pair) => [truncate(pair[0]), truncate(pair[1])])
    .sort((a, b) => a[0].localeCompare(b[0]));
  printTable(headers, data);
}
