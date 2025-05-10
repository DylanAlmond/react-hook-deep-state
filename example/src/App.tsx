import { useState } from 'react';
import useDeepState from '../../src/hooks/useDeepState';
import './index.css';
import Preview from './Preview';
import type { StateUpdate } from '../../src/types';

// Example Type
type UserData = {
  user: {
    name: string;
    address: {
      city: 'London' | 'Berlin' | 'Tokyo' | 'Canberra';
      zip: string;
      country?: 'GBR' | 'GER' | 'JPN' | 'AUS';
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
        zip: '10001'
      },
      active: true
    }
  });

  // For Preview Component
  const [lastChanges, setLastChanges] = useState<UserData | StateUpdate<UserData> | undefined>(
    undefined
  );

  // For Preview Component
  const setDeepState: typeof _setDeepState = (params) => {
    setLastChanges(params);
    _setDeepState(params);
  };

  const updateEntireState = () => {
    setDeepState({
      user: {
        name: 'Jane Doe',
        address: {
          city: 'Canberra',
          zip: '90001'
        },
        active: true
      }
    });
  };

  const updateNestedProperty = () => {
    setDeepState({
      path: 'user.address.city',
      value: 'Tokyo'
    });
  };

  const toggleNestedProperty = () => {
    setDeepState({
      path: 'user.active',
      value: !state.user.active
    });
  };

  const mergeNestedObject = () => {
    setDeepState({
      path: 'user.address',
      value: { zip: '94101', country: 'AUS' },
      merge: true
    });
  };

  const overrideNestedObject = () => {
    setDeepState({
      path: 'user.address',
      value: { city: 'Berlin', zip: '12345' },
      merge: false
    });
  };

  return (
    <div>
      <h1>react-hook-deep-state Demo</h1>
      <Preview state={state} changes={lastChanges} />
      <button onClick={updateEntireState}>Update Entire State</button>
      <button onClick={updateNestedProperty}>Update Nested Property</button>
      <button onClick={toggleNestedProperty}>Toggle Nested Property</button>
      <button onClick={mergeNestedObject}>Merge Nested Object</button>
      <button onClick={overrideNestedObject}>Override Nested Object</button>
    </div>
  );
};

export default App;

