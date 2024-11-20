/**
 * A custom hook for managing deeply nested state objects.
 * @param initialState - The initial state object.
 * @returns An array containing the current state and a function to update it.
 */
export declare function useDeepState<T extends Record<string, any>>(initialState?: T): readonly [T, (path: string, value: any, merge?: boolean) => void];

export { }
