![NPM Version](https://img.shields.io/npm/v/react-hook-deep-state)
![NPM Last Update](https://img.shields.io/npm/last-update/react-hook-deep-state)
![NPM Type Definitions](https://img.shields.io/npm/types/react-hook-deep-state)
![NPM Downloads](https://img.shields.io/npm/dw/react-hook-deep-state)

# React Hook Deep State

Simple React hook for managing state for objects using dot notation.

## Table of Contents

- [React Hook Deep State](#react-hook-deep-state)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [API](#api)
    - [`useDeepState<T>(initialState?: T)`](#usedeepstatetinitialstate-t)
    - [`setDeepState(update: StateUpdate<T, P, M> | T)`](#setdeepstateupdate-stateupdatet-p-m--t)
      - [`StateUpdate<P, M>`](#stateupdatep-m)
    - [Examples](#examples)
      - [Replace the Entire State](#replace-the-entire-state)
      - [Update a Nested Property](#update-a-nested-property)
      - [Merge a Nested Object](#merge-a-nested-object)
      - [Override a Nested Object](#override-a-nested-object)
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

### `setDeepState(update: StateUpdate<T, P, M> | T)`

**Arguments**:

- `update`: The update object or the new state. It can be:
  - A plain object of type `T` to replace or merge the entire state.
  - A `StateUpdate` object to update a specific path.

#### `StateUpdate<P, M>`

A `StateUpdate` object has the following properties:

- `path`: A string `P` specifying the path to the property (e.g., `"nested.key"`).
- `value`: The value to assign at the given path. If `merge` is `false`, the type of `value` must exactly match the existing property's type. If merge is true, `value` will be a `deep partial` of that type.
- `merge` _(optional)_: A boolean `M` indicating whether to merge objects at the path. Defaults to `true`.

---

### Examples

#### Replace the Entire State

```tsx
setDeepState({ key: 'value' });
```

#### Update a Nested Property

```tsx
setDeepState({ path: 'nested.key', value: 'newValue' });
```

#### Merge a Nested Object

```tsx
setDeepState({
  path: 'nested.key',
  value: { subKey: 'newValue' }, // A deep partial type
  merge: true // Default behavior
});
```

#### Override a Nested Object

```tsx
setDeepState({
  path: 'nested.key',
  value: { subKey: 'newValue', subKey2: 123 }, // A "full" type
  merge: false
});
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
