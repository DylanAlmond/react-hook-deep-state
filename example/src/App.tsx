import { useState } from 'react';
import useDeepState from '../../src/hooks/useDeepState';
import './index.css';
import Preview from './Preview';

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
    hobbies: string[];
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
      active: true,
      hobbies: ['Reading', 'Hiking', 'Gaming']
    }
  });

  // For Preview Component
  const [lastChanges, setLastChanges] = useState<
    { path: string | undefined; merge: boolean | undefined; value: unknown } | undefined
  >(undefined);

  // For Preview Component
  const setDeepState: typeof _setDeepState = (value, path, merge) => {
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
          active: true,
          hobbies: ['Gaming', 'Skiing']
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

  const updateNestedArray = () => {
    const updatedHobbies = [...state.user.hobbies];
    updatedHobbies[0] = 'Skydiving';
    setDeepState(updatedHobbies, 'user.hobbies');
  };

  return (
    <div>
      <h1>react-hook-deep-state Demo</h1>
      <Preview state={state} changes={lastChanges} />

      <div>
        <label htmlFor='name'>Set Name:</label>
        <input
          type='text'
          id='name'
          name='name'
          value={state.user.name}
          onInput={(e) => setDeepState(e.currentTarget.value, 'user.name')}
        />
      </div>

      <button onClick={mergeEntireState}>Merge Entire State</button>
      <button onClick={overrideEntireState}>Override Entire State</button>
      <button onClick={updateNestedProperty}>Update Nested Property</button>
      <button onClick={toggleNestedProperty}>Toggle Nested Property</button>
      <button onClick={mergeNestedObject}>Merge Nested Object</button>
      <button onClick={overrideNestedObject}>Override Nested Object</button>
      <button onClick={updateNestedArray}>Update Nested Array</button>

      <p>
        <b>Disclaimer:</b> This project is not affiliated with the Illuminati, any government, or
        other "deep state" entities. It is purely a tool for managing deeply nested state in React
        applications.
      </p>
    </div>
  );
};

export default App;
