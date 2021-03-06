import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';

const Authors = ({ token }) => {
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');

  const authors = useQuery(ALL_AUTHORS);
  const [ updateAuthor ] = useMutation(EDIT_AUTHOR);

  const submit = (event) => {
    event.preventDefault();
    if (name) {
      updateAuthor({ variables: { name, born: Number(born) } });
      setName('');
      setBorn('');
    }
  };

  if (authors.loading) {
    return <div>Loading...</div>
  }

  const allAuthors = authors.data.allAuthors;

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th align='left'>
              Name
            </th>
            <th align='left'>
              Born
            </th>
            <th align='left'>
              Books
            </th>
          </tr>
          {allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      {token
        ?
          <>
            <h3>Set birth year</h3>
            <form onSubmit={submit}>
              <label>
                Name{' '}
                <select value={name} onChange={({ target }) => setName(target.value)}>
                  <option>Select one...</option>
                  {allAuthors.map(a =>
                    <option key={a.id} value={a.name}>{a.name}</option>
                  )}
                </select>
              </label>
              <div>
                Born{' '}
                <input
                  value={born}
                  type='number'
                  onChange={({ target }) => setBorn(target.value)}
                />
              </div>
              <button type='submit'>Update author</button>
            </form>
          </>
        :
          null
      }
    </div>
  );
};

export default Authors;