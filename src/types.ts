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
        ? T[K] extends unknown[]
          ? `${K}`
          : T[K] extends object
          ? `${K}` | `${K}.${NestedPaths<NonNullable<T[K]>>}`
          : `${K}`
        : never;
    }[keyof T]
  : never;

export type StateValue<T, P, M extends boolean> = M extends true
  ? PartialPathValue<T, P>
  : PathValue<T, P>;

export type PathValue<T, P> = P extends NestedPaths<T> ? Path<T, P> : T;
export type PartialPathValue<T, P> = P extends NestedPaths<T>
  ? DeepPartial<Path<T, P>>
  : DeepPartial<T>;

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
