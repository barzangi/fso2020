import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import { ALL_BOOKS, ALL_AUTHORS, CREATE_BOOK } from '../queries';

const NewBook = (props) => {
  const [title, setTitle] = useState('');
  const [author, setAuhtor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const [ createBook ] = useMutation(CREATE_BOOK, {
    refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS } ],
    onError: (error) => {
      props.setError(error.graphQLErrors[0].message)
    }
  });

  if (!props.show) {
    return null;
  }

  const submit = (event) => {
    event.preventDefault();
    
    createBook({ variables: { title, author, published: Number(published), genres } });

    setTitle('');
    setPublished('');
    setAuhtor('');
    setGenres([]);
    setGenre('');
  }

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };

  return (
    <div>
      <h2>Add book</h2>
      <form onSubmit={submit}>
        <div>
          Title{' '}
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author{' '}
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          Published{' '}
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">Add genre</button>
        </div>
        <div>
          Genres: {genres.join(' ')}
        </div>
        <button type='submit'>Create book</button>
      </form>
    </div>
  );
};

export default NewBook;