# React Hooks Deep State

Simple React hook for managing state for objects using dot notation.

## Table of Contents

- [React Hooks Deep State](#react-hooks-deep-state)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Example Usage](#example-usage)
  - [API](#api)
    - [`useDeepState<T>(initialState?: T)`](#usedeepstatetinitialstate-t)
    - [`setDeepState(path: string, value: any, merge: boolean = true)`](#setdeepstatepath-string-value-any-merge-boolean--true)
  - [Advanced Features](#advanced-features)
    - [Object Merging](#object-merging)
    - [Override](#override)
  - [Notes](#notes)

## Features

- **Deep State Management**: Allows direct updates to deeply nested properties without modifying the rest of the state tree.
- **Intuitive API**: Uses dot notation (`"object.property.subproperty"`) to specify the property to update.
- **Flexible Updates**: Supports both overriding and merging objects at any level of the state.

## Installation

```bash
yarn add https://github.com/DylanAlmond/react-hooks-deep-state.git
```

## Example Usage

```tsx
import useDeepState from './hooks/useDeepState';

const defaultUser = {
  details: {
    id: 0,
    name: 'Bob',
    contact: {
      email: 'bob@example.com'
    }
  }
};

function App() {
  const [user, updateUser] = useDeepState(defaultUser);

  return (
    <div>
      <button onClick={() => updateUser('details.id', user.details.id + 1)}>
        ID is {user.details.id}
      </button>

      <input
        type='text'
        value={user.details.name}
        onChange={(e) => updateUser('details.name', e.target.value)}
      />

      <input
        type='email'
        value={user.details.contact.email}
        onChange={(e) => updateUser('details.contact', { email: e.target.value })}
      />

      <p>{JSON.stringify(user.details)}</p>
    </div>
  );
}

export default App;
```

## API

### `useDeepState<T>(initialState?: T)`

**Arguments**:

- `initialState` _(optional)_: An initial state object of type `T`. Defaults to an empty object if not provided.

**Returns**: A tuple `[state, setDeepState]`

- `state`: The current state object.
- `setDeepState`: A function to update the state at a specific path.

---

### `setDeepState(path: string, value: any, merge: boolean = true)`

**Arguments**:

- `path`: A string specifying the path to the property (e.g., `"user.profile.name"`).
- `value`: The new value to set at the specified path.
- `merge` _(optional)_: Whether to merge the new value with the existing one if it's an object. Defaults to `true`.

## Advanced Features

### Object Merging

By default, if you provide an object to `setDeepState` with `merge` set to `true`, it will merge the new object with the existing one:

```tsx
// Merges 'phone' into the existing 'contact' object
updateUser('details.contact', { phone: '123-456-7890' });
```

### Override

To replace the current value entirely, set `merge` to `false`:

```tsx
// Replaces the 'contact' object with the new one
updateUser('details.contact', { phone: '123-456-7890' }, true);
```

## Notes

- Symbol keys are **not supported**.
- Avoid direct mutation of the returned state object; always use `setDeepState`.

