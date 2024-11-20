/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, test } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useState, act } from 'react';
import useDeepState from '../hooks/useDeepState'; // Adjust the import path if necessary

// @ts-expect-error - Fix `act` not setup error
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const ITERATIONS = 50;

const defaultValue = {
  details: {
    id: 0,
    name: 'Bob',
    contact: {
      email: 'bob@example.com'
    }
  }
};

// Helper function to create a large nested object
const createLargeObject = (depth: number, width: number): Record<string, any> | null => {
  if (depth === 0) return null;
  const obj: Record<string, any> = {};
  for (let i = 0; i < width; i++) {
    obj[`key${i}`] = createLargeObject(depth - 1, width);
  }
  return obj;
};

// Function to run a performance test multiple times and collect statistics
const measurePerformance = (
  hook: () => any,
  updateFn: (result: any) => void,
  iterations: number
) => {
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const { result } = renderHook(hook);

    const start = performance.now();
    act(() => {
      updateFn(result);
    });
    const end = performance.now();

    times.push(end - start);
  }

  const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
  const lowestTime = Math.min(...times);
  const highestTime = Math.max(...times);

  return {
    averageTime: averageTime.toFixed(2) + 'ms',
    lowestTime: lowestTime.toFixed(2) + 'ms',
    highestTime: highestTime.toFixed(2) + 'ms'
  };
};

describe('useDeepState vs useState performance', () => {
  const largeObject = createLargeObject(6, 3); // Create a large object

  if (!largeObject) return;

  test('useState update performance', () => {
    const stats = measurePerformance(
      () => useState(largeObject),
      (result) => {
        result.current[1]({
          ...result.current[0],
          key1: { ...result.current[0].key0, newKey: 'newValue' }
        });
      },
      ITERATIONS
    );
    console.log(`useState performance: `, stats);
  });

  test('useDeepState update performance', () => {
    const stats = measurePerformance(
      () => useDeepState(largeObject),
      (result) => {
        result.current[1]('key1.key2.key3.newKey', 'newValue');
      },
      ITERATIONS
    );

    console.log(`useDeepState performance: `, stats);
  });
});

describe('useDeepState', () => {
  it('should return the initial state', () => {
    const { result } = renderHook(() => useDeepState(defaultValue));

    expect(result.current[0]).toBe(defaultValue);
  });

  it('should allow the initial state to be undefined', () => {
    const { result } = renderHook(() => useDeepState(undefined));

    expect(result.current[0]).toBe(undefined);
  });

  it('should update the existing state to a string', () => {
    const { result } = renderHook(() => useDeepState(defaultValue));

    act(() => {
      result.current[1]('', 'Hello World!'); // We're modifying the root so pass an empty string
    });

    expect(result.current[0]).toBe('Hello World!');
  });

  it('should update the existing value to undefined', () => {
    const { result } = renderHook(() => useDeepState(defaultValue));

    act(() => {
      result.current[1]('details.contact', undefined);
    });

    expect(result.current[0]).toStrictEqual({
      details: {
        id: 0,
        name: 'Bob',
        contact: undefined
      }
    });
  });

  it('should update the existing value by merging', () => {
    const { result } = renderHook(() => useDeepState(defaultValue));

    act(() => {
      result.current[1]('details', { name: 'Dave' }); // `Merge` should be true by default
    });

    expect(result.current[0]).toStrictEqual({
      details: {
        id: 0,
        name: 'Dave',
        contact: {
          email: 'bob@example.com'
        }
      }
    });
  });

  it('should update the existing value without merging', () => {
    const { result } = renderHook(() => useDeepState(defaultValue));

    act(() => {
      result.current[1]('details', { id: 1, phone: '1234' }, false);
    });

    expect(result.current[0]).toStrictEqual({
      details: { id: 1, phone: '1234' }
    });
  });

  it('should not merge any changes if the existing value is not an object', () => {
    const { result } = renderHook(() => useDeepState(defaultValue));

    act(() => {
      result.current[1]('details.contact.email', 'dave@example.com'); // `Merge` should be true by default
    });

    expect(result.current[0]).toStrictEqual({
      details: {
        id: 0,
        name: 'Bob',
        contact: {
          email: 'dave@example.com'
        }
      }
    });
  });
});
