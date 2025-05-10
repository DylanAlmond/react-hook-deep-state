/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Type guard to check if a value is an object.
 * @param value - The value to check.
 * @returns True if the value is an object, false otherwise.
 */
export function isObject(value: any): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Helper function for deep merging two objects.
 * @param target - The object to merge changes into.
 * @param source - The object to merge changes from.
 * @returns The merged object.
 */
export function deepMerge<T extends object, U extends object>(target: T, source: U): T & U {
  const result = { ...target } as T & U;

  for (const key of Object.keys(source) as Array<keyof U>) {
    const sourceValue = source[key];

    if (isObject(sourceValue)) {
      const targetValue = (result as any)[key]; // Temporarily unsafe
      if (isObject(targetValue)) {
        (result as any)[key] = deepMerge(targetValue, sourceValue);
      } else {
        (result as any)[key] = deepMerge({}, sourceValue);
      }
    } else {
      (result as any)[key] = sourceValue;
    }
  }

  return result;
}
