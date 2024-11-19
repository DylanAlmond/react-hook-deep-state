/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';

// type Join<K, P> = K extends string | number
//   ? P extends string | number
//     ? `${K}.${P}`
//     : never
//   : never;

// type Paths<T> = T extends object
//   ? {
//       [K in keyof T]: K extends string
//         ? T[K] extends Record<string, any>
//           ? K | Join<K, Paths<T[K]>>
//           : K
//         : never;
//     }[keyof T]
//   : never;

/**
 * A custom hook for managing deeply nested state objects.
 * @param initialState - The initial state object.
 * @returns An array containing the current state and a function to update it.
 */
function useDeepState<T extends Record<string, any>>(initialState?: T) {
  const [state, setState] = useState<T>(initialState || ({} as T));

  /**
   * Type guard to check if a value is an object.
   * @param value - The value to check.
   * @returns True if the value is an object, false otherwise.
   */
  const isObject = (value: any): value is Record<string, any> =>
    value !== null && typeof value === 'object' && !Array.isArray(value);

  /**
   * Updates the state at a specific path using dot notation.
   * @param path - Dot-notated path to the property (e.g., "user.profile.name").
   * @param value - New value to set at the specified path.
   * @param merge - If the property is an object, should we merge the value?
   */
  const setDeepState = useCallback(
    (path: string /*Paths<T>*/, value: any, merge: boolean = true) => {
      setState((prevState) => {
        const keys = path.split('.') as (keyof any)[];
        const newState = { ...prevState }; // Shallow clone the root state
        let current: Record<string, any> = newState; // Explicitly declare mutable reference

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];

          if (typeof key === 'symbol') {
            // Handle symbols differently if needed, or skip
            throw new Error('Symbol keys are not supported');
          }

          if (i === keys.length - 1) {
            // Check if we should merge the value into the current object
            if (merge || !isObject(value)) {
              current[key] = value;
            } else {
              current[key] = { ...current[key], ...value };
            }
          } else {
            // Check if the current key exists and is an object
            if (!isObject(current[key])) {
              current[key] = {}; // Initialize as an empty object if invalid
            }

            current = current[key]; // Drill down into the object
          }
        }

        return newState;
      });
    },
    []
  );

  return [state, setDeepState] as const;
}

export default useDeepState;
