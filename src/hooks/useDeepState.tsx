/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { deepMerge, isObject } from '../util';

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
 * @param initialState - The initial state, optional and can be undefined.
 * @returns An array containing the current state and a function to update it.
 */
function useDeepState<T extends Record<string, any> | any>(initialState?: T) {
  const [state, setState] = useState<T>(initialState as T);

  /**
   * Updates the state at a specific path using dot notation.
   * @param path - Dot-notated path to the property (e.g., "user.profile.name"). If empty or undefined, updates the root.
   * @param value - New value to set at the specified path.
   * @param merge - If the property is an object, should we merge the value?
   */
  const setDeepState = useCallback(
    (path?: string /*Paths<T>*/, value?: any, merge: boolean = true) => {
      setState((prevState) => {
        // If no path is provided, update the root
        if (!path) {
          if (merge && isObject(prevState) && isObject(value)) {
            return deepMerge({ ...prevState }, value); // Deep merge at the root
          }
          return value as T;
        }

        // If our state is not an object, replace with the new value
        if (!isObject(prevState)) {
          return value;
        }

        const keys = path.split('.') as (keyof any)[];
        const newState = structuredClone(prevState); // Deep clone the root state
        let currentScope: Record<string, any> = newState; // Start at the root of the object

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];

          if (typeof key === 'symbol') {
            throw new Error('Symbol keys are not supported');
          }

          if (i === keys.length - 1) {
            // If merging, perform deep merge
            if (merge && isObject(currentScope[key]) && isObject(value)) {
              currentScope[key] = deepMerge(currentScope[key], value);
            } else {
              currentScope[key] = value; // Otherwise just set the value
            }
          } else {
            // Initialize the current key as an empty object if it doesn't exist
            if (!isObject(currentScope[key])) {
              currentScope[key] = {};
            }

            currentScope = currentScope[key]; // Drill down into the object
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
