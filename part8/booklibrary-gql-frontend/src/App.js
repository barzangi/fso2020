import React, { useState } from 'react';
import { useApolloClient, useQuery, useSubscription } from '@apollo/client';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Recommended from './components/Recommended';

import { ALL_BOOKS, BOOK_ADDED } from './queries';

const Menu = ({ token, logout }) => {
  const menuStyle = {
    padding: 5,
    backgroundColor: 'lightgrey'
  }
  return (
    <>
      <Link style={menuStyle} to='/'>Authors</Link>
      <Link style={menuStyle} to='/books'>Books</Link>
      {token
        ?
        <>
          <Link style={menuStyle} to='/add-book'>Add Book</Link>
          <Link style={menuStyle} to='/recommended'>Recommended</Link>
          <span style={menuStyle}><button onClick={logout}>Log out</button></span>
        </>
        :
          <Link style={menuStyle} to='/login'>Log in</Link>
      }
    </>
  );
};

const Notify = ({ errorMessage }) => {
  if (!errorMessage) return null;

  return (
    <div style={{ color: 'red', marginBottom: 15 }}>
      {errorMessage}
    </div>
  );
};

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  const booksResult = useQuery(ALL_BOOKS);

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map(b => b.id).includes(object.id);

    const dataInStore = client.readQuery({ query: ALL_BOOKS });
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook) }
      });
    }
  };

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;
      notify(`${addedBook.title} added`);
      updateCacheWith(addedBook);
    }
  });

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
  };

  return (
    <Router>
      <Notify errorMessage={errorMessage} />
      <Menu token={token} logout={logout} />

      <Switch>
        <Route path='/books'>
          <Books booksResult={booksResult} />
        </Route>
        <Route path='/login'>
        <LoginForm setError={notify} setToken={setToken} />
        </Route>
        <Route path='/add-book'>
          <NewBook setError={notify} updateCacheWith={updateCacheWith} />
        </Route>
        <Route path='/recommended'>
          <Recommended booksResult={booksResult} setError={notify} />
        </Route>
        <Route path='/'>
          <Authors token={token} />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;