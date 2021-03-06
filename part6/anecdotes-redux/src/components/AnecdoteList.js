import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { vote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const filterText = useSelector(state => state.filter);
  const anecdotes = useSelector(state => state.anecdotes)
    .sort((a, b) => b.votes - a.votes)
    .filter(anecdote => anecdote.content.toLowerCase().includes(filterText.toLowerCase()));

  const anecdoteStyle = {
    marginBottom: 20
  };

  const doVote = async (anecdote) => {
    dispatch(vote(anecdote));
    dispatch(setNotification(anecdote.content, 4));
  }

  return (
    <>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id} style={anecdoteStyle}>
          <div style={{ marginBottom: 8 }}>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}{' '}
            <button onClick={() => doVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AnecdoteList;