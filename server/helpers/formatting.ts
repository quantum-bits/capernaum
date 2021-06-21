import prettyFormat from "pretty-format";
import { table, TableUserConfig } from "table";
import chalk from "chalk";
import * as _ from "lodash";

export function printPretty(val: unknown) {
  console.log(prettyFormat(val));
}

export function printTable(
  headers: string[],
  data: Array<Array<string | number>>,
  userConfig?: TableUserConfig
) {
  if (data.length === 0) {
    // No data rows to show.
    const empty = _.fill(Array(headers.length), "");
    const emptyMessage = "[NO DATA]";
    if (empty.length < 3) {
      empty[0] = emptyMessage;
    } else {
      empty[Math.floor(empty.length / 2)] = emptyMessage;
    }
    data.unshift(empty);
  }
  data.unshift(headers.map((header) => chalk.blue(header)));

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
