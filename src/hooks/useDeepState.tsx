import { useState } from 'react';
import { deepMerge, isObject } from '../util';
import { isPathUpdate, StateType, StateUpdate } from '../types';

/**
 * A custom hook for managing deeply nested state objects with type safety.
 * @param initialState - The initial state object
 * @returns [state, setState] tuple with strongly typed path-based setter
 */
function useDeepState<T extends StateType>(initialState?: T) {
  const [state, setState] = useState<T>(initialState as T);

  /**
   * Updates the state either entirely or at a specific path.
   *
   * - If the `update` parameter is a plain object, it replaces or merges with the entire state.
   * - If the `update` parameter contains a `path`, it updates the state at the specified path.
   *
   * @template P - The type of the path string.
   * @template M - A boolean indicating whether to merge objects at the path.
   * @param update - The update object or the new state. If an object with a `path` is provided,
   *                 it updates the state at the specified path. Otherwise, it replaces or merges
   *                 the entire state.
   *
   * @example
   * // Replace the entire state
   * setDeepState({ key: 'value' });
   *
   * @example
   * // Update a nested property
   * setDeepState({ path: 'nested.key', value: 'newValue' });
   *
   * @example
   * // Merge a nested object
   * setDeepState({ path: 'nested.key', value: { subKey: 'newValue' }, merge: true });
   *
   * @example
   * // Override a nested object
   * setDeepState({
   *  path: 'nested.key',
   *  value: { subKey: 'newValue', subKey2: 123 },
   *  merge: false
   * });
   */
  const setDeepState = <P extends string, M extends boolean>(update: StateUpdate<T, P, M> | T) => {
    // Case 1: No path provided, update the entire state
    if (!isObject(update) || !('value' in update)) {
      setState((prevState) => {
        const newValue = update as T;

        // Check we're merging two objects
        if (isObject(prevState) && isObject(newValue)) {
          return deepMerge({ ...prevState }, newValue);
        }

        return newValue;
      });
      return;
    }

    // Handle object-based update configuration
    if (isPathUpdate(update)) {
      // Path-based update
      const { path, value, merge = true } = update;

      setState((prevState) => {
        // If our current state is not an object type, make no changes
        if (!isObject(prevState)) {
          console.warn(`Attempting to set key value pair to invalid type "${typeof prevState}"`);
          return prevState;
        }

        const keys = path.split('.');

        const newState = structuredClone(prevState);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let current = newState as Record<string, any>;

        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          // Initialize missing objects in the path
          if (!isObject(current[key])) current[key] = {};
          current = current[key];
        }

        const lastKey = keys[keys.length - 1];

        // Apply value at the final path destination
        if (merge && isObject(current[lastKey]) && isObject(value)) {
          current[lastKey] = deepMerge(current[lastKey], value);
        } else {
          current[lastKey] = value;
        }

        return newState;
      });
    }
  };

  return [state, setDeepState] as const;
}

export default useDeepState;
