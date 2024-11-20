/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Type guard to check if a value is an object.
 * @param value - The value to check.
 * @returns True if the value is an object, false otherwise.
 */
export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Helper function for deep merging two objects.
 * @param target - The object to merge changes into.
 * @param source - The object to merge changes from.
 * @returns The merged object.
 */
export function deepMerge(
  target: Record<string, any>,
  source: Record<string, any>
): Record<string, any> {
  for (const key of Object.keys(source)) {
    if (isObject(source[key])) {
      if (!target[key] || !isObject(target[key])) {
        target[key] = {}; // Create an empty object if it doesn't exist
      }
      target[key] = deepMerge(target[key], source[key]); // Recursively merge objects
    } else {
      target[key] = source[key]; // Directly set primitive values
    }
  }
  return target;
}
