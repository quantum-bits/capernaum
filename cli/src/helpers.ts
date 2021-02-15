// Ensure a value is neither undefined nor null.
// From https://stackoverflow.com/a/54738437/1477144a
export function ensureValue<T>(
  arg: T | undefined | null,
  message = "Value expected."
): T {
  if (arg === undefined || arg === null) {
    throw new TypeError(message);
  }
  return arg;
}

// From https://dev.to/krumpet/generic-type-guard-in-typescript-258l
type Constructor<T> = { new (...args: any[]): T };
export function typeGuard<T>(obj: any, className: Constructor<T>): obj is T {
  return obj instanceof className;
}

export function ensureType<T>(obj: any, className: Constructor<T>): T {
  if (obj instanceof className) {
    return obj;
  }
  throw new TypeError(`${obj} not an instance of ${className}`);
}
