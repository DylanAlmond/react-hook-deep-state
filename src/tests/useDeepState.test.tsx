import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useDeepState from '../hooks/useDeepState'; // Adjust the import path if necessary

// @ts-expect-error - Fix `act` not setup error
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// const ITERATIONS = 10000;

const defaultValue = {
  details: {
    id: 0,
    name: 'Bob',
    contact: {
      email: 'bob@example.com',
      tel: '123 456 7890'
    }
  }
};

type defaultValueType = typeof defaultValue;

// // Function to run a performance test multiple times and collect statistics
// function measurePerformance(hook: () => any, updateFn: (result: any) => void, iterations: number) {
//   const times: number[] = [];
//   let firstOutput;

//   for (let i = 0; i < iterations; i++) {
//     const { result } = renderHook(hook);

//     const start = performance.now();
//     act(() => {
//       updateFn(result);
//     });
//     const end = performance.now();

//     times.push(end - start);

//     if (i === 0) {
//       firstOutput = result.current[0];
//     }
//   }

//   const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
//   const lowestTime = Math.min(...times);
//   const highestTime = Math.max(...times);

//   return {
//     averageTime: averageTime.toFixed(2) + 'ms',
//     lowestTime: lowestTime.toFixed(2) + 'ms',
//     highestTime: highestTime.toFixed(2) + 'ms',
//     output: firstOutput
//   };
// }

// describe('useDeepState vs useState performance', () => {
//   test('useState performance', () => {
//     const stats = measurePerformance(
//       () => useState(defaultValue),
//       (result) => {
//         result.current[1]({
//           ...result.current[0],
//           details: {
//             ...result.current[0].details,
//             name: 'Dave',
//             contact: {
//               ...result.current[0].details.contact,
//               email: 'dave@example.com'
//             }
//           }
//         });
//       },
//       ITERATIONS
//     );

//     console.log('useState performance: ');
//     console.dir(stats, { depth: null });
//   });

//   test('useDeepState performance (merge)', () => {
//     const stats = measurePerformance(
//       () => useDeepState(defaultValue),
//       (result) => {
//         result.current[1]({
//           path: 'details',
//           value: {
//             name: 'Dave',
//             contact: {
//               email: 'dave@example.com'
//             }
//           },
//           merge: true
//         });
//       },
//       ITERATIONS
//     );

//     console.log('useDeepState performance (merge): ');
//     console.dir(stats, { depth: null });
//   });

//   test('useDeepState performance (override)', () => {
//     const stats = measurePerformance(
//       () => useDeepState(defaultValue),
//       (result) => {
//         result.current[1]({
//           path: 'details',
//           value: {
//             name: 'Dave',
//             contact: {
//               email: 'dave@example.com'
//             }
//           },
//           merge: true
//         });
//       },
//       ITERATIONS
//     );

//     console.log('useDeepState performance (no-merge): ');
//     console.dir(stats, { depth: null });
//   });
// });

describe('useDeepState', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useDeepState(defaultValue));

    expect(result.current[0]).toBe(defaultValue);
  });

  it('should allow initial state to be undefined', () => {
    const { result } = renderHook(() => useDeepState(undefined));

    expect(result.current[0]).toBe(undefined);
  });

  it('should allow null type to be set if specified', () => {
    const { result } = renderHook(() => useDeepState<defaultValueType | null>(defaultValue));

    act(() => {
      result.current[1](null);
    });

    expect(result.current[0]).toStrictEqual(null);
  });

  it('should deep merge state by default', () => {
    const { result } = renderHook(() => useDeepState(defaultValue));

    act(() => {
      result.current[1]({
        details: {
          id: 1,
          contact: {
            email: 'dave@example.com'
          }
        }
      });
    });

    expect(result.current[0]).toStrictEqual({
      details: {
        id: 1,
        name: 'Bob',
        contact: {
          email: 'dave@example.com',
          tel: '123 456 7890'
        }
      }
    });
  });

  it('should override state if merge set to false', () => {
    const { result } = renderHook(() => useDeepState(defaultValue));

    act(() => {
      result.current[1](
        {
          details: {
            id: 2,
            name: 'Terry',
            contact: {
              email: 'terry@example.com',
              tel: '+123 456 7890'
            }
          }
        },
        '',
        false
      );
    });

    expect(result.current[0]).toStrictEqual({
      details: {
        id: 2,
        name: 'Terry',
        contact: {
          email: 'terry@example.com',
          tel: '+123 456 7890'
        }
      }
    });
  });

  it('should merge nested object by default', () => {
    const { result } = renderHook(() => useDeepState(defaultValue));

    act(() => {
      result.current[1]({ name: 'Dave' }, 'details'); // `Merge` should be true by default
    });

    expect(result.current[0]).toStrictEqual({
      details: {
        id: 0,
        name: 'Dave',
        contact: {
          email: 'bob@example.com',
          tel: '123 456 7890'
        }
      }
    });
  });

  it('should override nested object if merge set to false', () => {
    const { result } = renderHook(() => useDeepState(defaultValue));

    act(() => {
      result.current[1](
        { email: 'dave@example.com', tel: '123 456 7890' },
        'details.contact',
        false
      );
    });

    expect(result.current[0]).toStrictEqual({
      details: {
        id: 0,
        name: 'Bob',
        contact: {
          email: 'dave@example.com',
          tel: '123 456 7890'
        }
      }
    });
  });

  it('should not merge any changes if the current state is not an object', () => {
    // @ts-expect-error yeah
    const { result } = renderHook(() => useDeepState<defaultValueType | string>('Hello, World!'));

    act(() => {
      // @ts-expect-error - We are rightly pointing out a type error, however we want to test a type mismatch on purpose
      result.current[1]('dave@example.com', 'details.contact.email'); // `Merge` should be true by default
    });

    expect(result.current[0]).toStrictEqual('Hello, World!');
  });
});
