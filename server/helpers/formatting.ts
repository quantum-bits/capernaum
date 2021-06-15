import prettyFormat from "pretty-format";
import { table, TableUserConfig } from "table";
import { getDebugger } from "@helpers/debug-factory";
import chalk from "chalk";

const debug = getDebugger("helpers");

export function printPretty(val: unknown) {
  console.log(prettyFormat(val));
}

export function printTable(
  headers: string[],
  data: string[][],
  userConfig?: TableUserConfig
) {
  data.unshift(headers.map((header) => chalk.blue(header)));
  debug("table data %O", data);

  const config: TableUserConfig = {
    drawVerticalLine: () => false,
    drawHorizontalLine: (lineIndex, rowCount) => {
      return (
        lineIndex === 0 ||
        lineIndex === 1 ||
        (userConfig?.header && lineIndex === 2) ||
        lineIndex === rowCount
      );
    },
    ...userConfig,
  };

  console.log(table(data, config));
}
