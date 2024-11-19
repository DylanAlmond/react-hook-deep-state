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

