![NPM Version](https://img.shields.io/npm/v/react-hook-deep-state)
![NPM Last Update](https://img.shields.io/npm/last-update/react-hook-deep-state)
![NPM Type Definitions](https://img.shields.io/npm/types/react-hook-deep-state)
![NPM Downloads](https://img.shields.io/npm/dw/react-hook-deep-state)

# React Hook Deep State

A tiny React hook for managing state for objects using dot notation.

## Table of Contents

- [React Hook Deep State](#react-hook-deep-state)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [API](#api)
    - [`useDeepState<T>(initialState?: T)`](#usedeepstatetinitialstate-t)
    - [`setDeepState(value: StateValue<T, P, M>, path?: P, merge?: M)`](#setdeepstatevalue-statevaluet-p-m-path-p-merge-m)
    - [Examples](#examples)
      - [Usage](#usage)
      - [Updating the Entire State](#updating-the-entire-state)
      - [Update a Nested Property](#update-a-nested-property)
      - [Merge a Nested Object](#merge-a-nested-object)
      - [Override a Nested Object](#override-a-nested-object)
      - [Update a Nested Array](#update-a-nested-array)
  - [Running the Example Project](#running-the-example-project)
    - [Steps to Run the Example:](#steps-to-run-the-example)
  - [License](#license)

## Features

- **Deep State Management**: Allows direct updates to deeply nested properties without modifying the rest of the state tree.
- **Intuitive API**: Uses dot notation (`"object.property.subproperty"`) to specify the property to update.
- **Flexible Updates**: Supports both overriding and merging objects at any level of the state.

## Installation

```bash
yarn add react-hook-deep-state
```

## API

### `useDeepState<T>(initialState?: T)`

**Arguments**:

- `initialState` _(optional)_: An initial state object of type `T`. Defaults to `undefined` if not provided.

**Returns**: A tuple `[state, setDeepState]`

- `state`: The current state object of type `T`.
- `setDeepState`: A function to update the state at a specific path.

---

### `setDeepState(value: StateValue<T, P, M>, path?: P, merge?: M)`

**Arguments**:

- `value`: The new value to set. The type of `value` depends on the `path` and `merge` parameters:
  - If `merge` is `true`, `value` can be a deep partial object for merging.
  - If `merge` is `false`, `value` must match the exact type of the property at the specified path.
- `path` _(optional)_: A string specifying the path to the property (e.g., `"nested.key"`). If omitted or `""`, the entire state is updated.
- `merge` _(optional)_: A boolean indicating whether to merge objects at the specified path. Defaults to `true`.

---

### Examples

#### Usage

```tsx
import React from 'react';
import { useDeepState } from 'react-hook-deep-state';

const App = () => {
  const [appState, setAppState] = useDeepState({
    user: {
      name: 'John Doe',
      address: {
        city: 'London',
        zip: '76321',
        country: 'GBR'
      },
      active: false,
      hobbies: []
    }
  });

  return (
    <div>
      <p>City: {appState.user.address.city}</p>
      <p>Active: {appState.user.active ? 'Yes' : 'No'}</p>

      <div>
        <label htmlFor='name'>Set Name:</label>
        <input
          type='text'
          id='name'
          name='name'
          value={appState.user.name}
          onInput={(e) => setAppState(e.currentTarget.value, 'user.name')}
        />
      </div>
    </div>
  );
};
```

#### Updating the Entire State

```tsx
setAppState(
  {
    user: {
      name: 'Jane Doe',
      address: {
        city: 'Berlin',
        zip: '12345',
        country: 'GER'
      },
      active: true,
      hobbies: ['Cycling', 'Swimming']
    }
  },
  '', // or undefined
  true // Merge by default, set to false to override current value
);
```

#### Update a Nested Property

```tsx
setAppState('Tokyo', 'user.address.city');
```

#### Merge a Nested Object

```tsx
setAppState({ zip: '94101', country: 'JAP' }, 'user.address', true);
```

#### Override a Nested Object

```tsx
setAppState({ city: 'Canberra', zip: '90001', country: 'AUS' }, 'user.address', false);
```

#### Update a Nested Array

```tsx
setAppState(['Skydiving', 'Hiking'], 'user.hobbies');
```

## Running the Example Project

To see `react-hook-deep-state` in action, you can run the example project included in this repository.

### Steps to Run the Example:

1. **Install Dependencies**:
   Navigate to the root of the project and install the dependencies:

   ```bash
   yarn install
   ```

2. **Navigate to the Example Folder**:
   Move into the `example` folder:

   ```bash
   cd example
   ```

3. **Install Example Dependencies**:
   Install the dependencies for the example project:

   ```bash
   yarn install
   ```

4. **Start the Development Server**:
   Run the example project:

   ```bash
   yarn dev
   ```

5. **View in Browser**:
   Open your browser and navigate to `http://localhost:5173` to interact with the example project.

## License

This project is licensed under the [MIT License](LICENSE).

---

**Disclaimer**: This project is not affiliated with the Illuminati, any government, or other "deep state" entities. It is purely a tool for managing deeply nested state in React applications.
