export type StateType = Record<string, unknown> | undefined | null;

// Type definitions for path-based access
export type Path<T, K extends string> = K extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Path<T[Key], Rest>
    : never
  : K extends keyof T
  ? T[K]
  : never;

// Intellisense
export type NestedPaths<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? T[K] extends object
          ? `${K}` | `${K}.${NestedPaths<NonNullable<T[K]>>}`
          : `${K}`
        : never;
    }[keyof T]
  : never;

export type StateUpdate<T, P extends string = string, M extends boolean = boolean> = {
  path: P & NestedPaths<T>;
  value: M extends true ? DeepPartial<Path<T, P>> : Path<T, P>;
  merge?: M;
};

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * Type guard to check if update is a path update
 */
export const isPathUpdate = <T extends StateType, M extends boolean>(
  update: T | StateUpdate<T, string, M>
): update is StateUpdate<T, string, M> => {
  return !!update && 'path' in update && typeof update.path === 'string';
};
