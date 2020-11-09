import React, { useState } from 'react';
import { useQuery } from '@apollo/client';

import { ALL_BOOKS } from '../queries';

const Books = (props) => {
  const result = useQuery(ALL_BOOKS);
  const [genreFilter, setGenreFilter] = useState('');

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>Loading...</div>
  }

  const books = result.data.allBooks;

  const uniqueGenres = [ ...new Set(books.map(b => b.genres.map(g => g)).flat())];

  const filteredBooks = genreFilter ? books.filter(b => b.genres.includes(genreFilter)) : books;

  return (
    <div>
      <h2>Books</h2>

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
          {filteredBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h3>Filter by genre: {genreFilter ? genreFilter : 'all'}</h3>
      <button onClick={() => setGenreFilter('')}>all</button>
      {uniqueGenres.map(genre =>
        <button
          key={genre}
          onClick={() => setGenreFilter(genre)}
        >{genre}</button>
      )}
    </div>
  );
};

export default Books;