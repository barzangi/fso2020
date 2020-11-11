import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../queries';

const LoginForm = ({ setError, setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    }
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem('booklibrary-user-token', token);
      history.push('/');
    }
  }, [result.data]); // eslint-disable-line

  const submit = (event) => {
    event.preventDefault();

    login({ variables: { username, password } });
    setUsername('');
    setPassword('');
  };

  return (
    <>
      <h2>Log in</h2>
      <form onSubmit={submit}>
        <div>
          Username{' '}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password{' '}
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>Log in</button>
      </form>
    </>
  );
};

export default LoginForm;