import React from 'react';
import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { USER } from '../queries';

const Recommended = ({ booksResult, setError }) => {
  const userResult = useQuery(USER);
  const history = useHistory();
  console.log('userResult', userResult);

  if (booksResult.loading) {
    return <div>Loading...</div>
  }

  const books = booksResult.data.allBooks;

  let favGenre;

  if (!userResult.data || !userResult.data.me) {
    favGenre = null;
  } else {
    favGenre = userResult.data.me.favGenre;
  }

  if (!favGenre) {
    history.push('/');
    setError('An error occurred');
    return null;
  }

  const userBooks = books.filter(b => b.genres.includes(favGenre));

  return (
    <>
      <h2>Recommendations</h2>
      <p>Books in your favourite genre: <strong>{favGenre}</strong></p>
      <table>
        <tbody>
          <tr>
            <th align='left'>
              Title
            </th>
            <th align='left'>
              Author
            </th>
            <th align='left'>
              Published
            </th>
          </tr>
          {userBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default Recommended;