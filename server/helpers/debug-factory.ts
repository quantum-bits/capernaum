import debug from "debug";

const PREFIX = "cap";

interface DebugCache {
  [name: string]: debug.Debugger;
}

const debugCache: DebugCache = {};

export function getDebugger(name: string) {
  if (!debugCache[name]) {
    debugCache[name] = debug(`${PREFIX}:${name}`);
  }
  return debugCache[name];
}

/**
 * Enable debugging output programmatically.
 * Note that this is on the debug module itself, not an instances.
 * @param namespaces namespaces to enable (same syntax as on the command line)
 */
export function enableDebugOutput(namespaces: string) {
  debug.enable(namespaces);
}
