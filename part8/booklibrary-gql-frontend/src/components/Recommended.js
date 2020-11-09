import React from 'react';
import { useQuery } from '@apollo/client';

import { ALL_BOOKS, USER } from '../queries';

const Recommended = (props) => {
  const result = useQuery(ALL_BOOKS);
  const user = useQuery(USER);

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>Loading...</div>
  }

  const books = result.data.allBooks;

  const favGenre = user.data.me.favGenre;

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