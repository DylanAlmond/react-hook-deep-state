/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

interface PreviewProps<T extends Record<string, any>> {
  state: T;
  changes: { path: string | undefined; merge: boolean | undefined; value: unknown } | undefined;
}

/**
 * State Update Preview Component
 *
 * Renders the current state object and highlights any changes made via the setter function.
 */
const Preview = <T extends Record<string, any>>({ state, changes }: PreviewProps<T>) => {
  const renderChanges = () => {
    if (!changes || (changes && changes.path === '' && changes.merge === false)) {
      return (
        <pre className={changes ? 'updated' : undefined}>{JSON.stringify(state, null, 2)}</pre>
      );
    }

    const { path, value, merge } = changes;

    const pathArray = path?.split('.') ?? [];
    const mergeKeys = typeof value === 'object' && value !== null ? Object.keys(value) : undefined;

    const renderKeys = (
      target: any,
      targetPath: string[],
      value: any,
      level = 0
    ): React.ReactNode => {
      if (Array.isArray(target) || typeof target !== 'object' || target === null)
        return JSON.stringify(target);

      const indent = '  '.repeat(level);
      const keys = Object.keys(target);
      const valueKeys = typeof value === 'object' ? Object.keys(value) : [];

      return (
        <>
          {'{\n'}
          {keys.map((key, i, arr) => {
            const isTargetKey = key === targetPath[targetPath.length - 1];

            const shouldHighlight =
              (mergeKeys == null && level === targetPath.length - 1 && isTargetKey) ||
              (merge && level === targetPath.length && mergeKeys?.includes(key)) ||
              (!merge && level === targetPath.length - 1 && isTargetKey) ||
              (path === '' && merge === true && valueKeys?.includes(key));

            return (
              <div
                className={shouldHighlight ? 'updated' : merge === true ? 'no-update' : ''}
                key={key}
              >
                {` ${indent} "${key}"`}:{' '}
                {renderKeys(target[key], targetPath, value?.[key], level + 1)}
                {i !== arr.length - 1 && ','}
              </div>
            );
          })}
          {`${indent}}`}
        </>
      );
    };

    return <pre>{renderKeys(state, pathArray, value)}</pre>;
  };

  return (
    <>
      {renderChanges()}
      <p>
        <b>Note:</b> Values <span className='updated'>highlighted</span> show changes between state
        updates.
      </p>
    </>
  );
};

export default Preview;
