import Debug, { Debugger } from "debug";

const PREFIX = "cap:server";

interface DebugCache {
  [name: string]: Debugger;
}

const debugCache: DebugCache = {};

export function getDebugger(name: string): Debugger {
  if (!debugCache[name]) {
    debugCache[name] = Debug(`${PREFIX}:${name}`);
  }
  return debugCache[name];
}
