import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { vote } from '../reducers/anecdoteReducer';

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(state => state).sort((a, b) => b.votes - a.votes);

  const anecdoteStyle = {
    marginBottom: 10
  };

  return (
    <>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id} style={anecdoteStyle}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}{' '}
            <button onClick={() => dispatch(vote(anecdote.id))}>vote</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AnecdoteList;