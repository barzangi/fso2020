import React, { useState } from 'react';
import { useApolloClient } from '@apollo/client';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Recommended from './components/Recommended';

const Notify = ({ errorMessage }) => {
  if (!errorMessage) return null;

  return (
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>
  );
};

const App = () => {
  const [page, setPage] = useState('authors');
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 4000);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    if (page === 'add') {
      setPage('authors');
    }
  };

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token
          ?
            <>
              <button onClick={() => setPage('add')}>add book</button>
              <button onClick={() => setPage('recommended')}>Recommended</button>
              <button onClick={logout}>Log out</button>
            </>
          :
            <button onClick={() => setPage('login')}>Log in</button>
        }
        
      </div>

      <Authors
        show={page === 'authors'}
        token={token}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
        setError={notify}
      />

      <Recommended
        show={page === 'recommended'}
      />

      <LoginForm
        show={page === 'login'}
        setError={notify}
        setToken={setToken}
        setPage={setPage}
      />
    </div>
  );
};

export default App;