import { useState } from 'react';
import useDeepState from '../../src/hooks/useDeepState';
import './index.css';
import Preview from './Preview';
import type { StateUpdate } from '../../src/types';
// import { useDeepState } from 'react-hook-deep-state';

// Example Type
type UserData = {
  user: {
    name: string;
    address: {
      city: 'London' | 'Berlin' | 'Tokyo' | 'Canberra' | 'Seoul';
      zip: string;
      country?: 'GBR' | 'GER' | 'JPN' | 'AUS' | 'KOR';
    };
    active: boolean;
  };
};

const App = () => {
  // Initialize the deep state with a nested object
  const [state, _setDeepState] = useDeepState<UserData>({
    user: {
      name: 'John Doe',
      address: {
        city: 'London',
        zip: '10001',
        country: 'GBR'
      },
      active: true
    }
  });

  // For Preview Component
  const [lastChanges, setLastChanges] = useState<UserData | StateUpdate<UserData> | undefined>(
    undefined
  );

  // For Preview Component
  const setDeepState: typeof _setDeepState = (value, path, merge) => {
    console.log(value, path, merge);

    // @ts-expect-error - out of date!
    setLastChanges({ path: path, merge: merge, value: value });
    _setDeepState(value, path, merge);
  };

  const mergeEntireState = () => {
    setDeepState(
      {
        user: {
          name: 'Jane Doe',
          address: {
            city: 'Seoul',
            zip: '43262'
          },
          active: true
        }
      },
      '',
      true
    );
  };

  const overrideEntireState = () => {
    setDeepState(
      {
        user: {
          name: 'Jane Doe',
          address: {
            city: 'Canberra',
            zip: '90001'
          },
          active: true
        }
      },
      '',
      false
    );
  };

  const updateNestedProperty = () => {
    setDeepState('Tokyo', 'user.address.city');
  };

  const toggleNestedProperty = () => {
    setDeepState(!state.user.active, 'user.active');
  };

  const mergeNestedObject = () => {
    setDeepState({ zip: '94101', country: 'AUS' }, 'user.address', true);
  };

  const overrideNestedObject = () => {
    setDeepState({ city: 'Berlin', zip: '12345' }, 'user.address', false);
  };

  return (
    <div>
      <h1>react-hook-deep-state Demo</h1>
      <Preview state={state} changes={lastChanges} />
      <button onClick={mergeEntireState}>Merge Entire State</button>
      <button onClick={overrideEntireState}>Override Entire State</button>
      <button onClick={updateNestedProperty}>Update Nested Property</button>
      <button onClick={toggleNestedProperty}>Toggle Nested Property</button>
      <button onClick={mergeNestedObject}>Merge Nested Object</button>
      <button onClick={overrideNestedObject}>Override Nested Object</button>
    </div>
  );
};

export default App;

