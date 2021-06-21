import debug from "debug";
import * as _ from "lodash";
import chalk from "chalk";
import { printTable } from "@helpers/formatting";

const BASE_NAMESPACE = "cap";

const debugCache = new Map<string, debug.Debugger>();

const baseDebug = debug(BASE_NAMESPACE);
debugCache.set(BASE_NAMESPACE, baseDebug);

export function getDebugger(name: string) {
  if (!debugCache.has(name)) {
    debugCache.set(name, baseDebug.extend(name));
  }
  return debugCache.get(name);
}

export function dumpDebugCache() {
  const keys = Array.from(debugCache.keys());

  const headers = ["Namespace", "Enabled"];
  const data = _.map(keys.sort(), (key) => {
    const debug = debugCache.get(key);
    return [
      debug.namespace,
      debug.enabled ? chalk.green("Yes") : chalk.red("No"),
    ];
  });
  printTable(headers, data);
}

/**
 * Enable debugging output programmatically.
 * Note that this is on the debug module _itself_,
 * not an instances.
 * @param namespaces namespaces to enable (same syntax as on the command line)
 */
export function enableDebugOutput(namespaces: string) {
  debug.enable(namespaces);
}
