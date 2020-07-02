export function inProductionMode(): boolean {
  return process.env.NODE_ENV === "production";
}

export function inDevelopmentMode(): boolean {
  return !inProductionMode();
}
