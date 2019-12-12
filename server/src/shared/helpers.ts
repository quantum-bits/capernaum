export function inProductionMode() {
  return process.env.NODE_ENV === "production";
}

export function inDevelopmentMode() {
  return !inProductionMode();
}
