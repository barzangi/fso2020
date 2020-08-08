import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const App = ({ anecdotes }) => {
  const [selected, setSelected] = useState(0);
  const [votes, updateVotes] = useState(() => {
    // initialize votes array with zero values
    let votesInit = new Array(anecdotes.length).fill(0);
    return votesInit;
  });

  // select a random anecdote
  const randomAnecdote = () => setSelected(Math.floor(Math.random() * anecdotes.length));

  // add vote to votes array
  const addVote = () => {
    const votesCopy = [...votes];
    votesCopy[selected] += 1;
    updateVotes(votesCopy);
  };

  // find index of anecdote with highest vote
  const topAnecdoteIndex = () => {
    // return -1 if no votes at all
    const sumOfVotes = votes.reduce((a, b) => a + b, 0);
    if (sumOfVotes === 0) return -1;
    return votes.indexOf(Math.max(...votes));
  };

  return (
    <>
      <h1>Anecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <div>Has {votes[selected]} votes</div>
      <button onClick={addVote}>vote</button>
      <button onClick={randomAnecdote}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      {topAnecdoteIndex() === -1
      ?
        <div>No votes yet</div>
      :
        <>
          <div>{anecdotes[topAnecdoteIndex()]}</div>
          <div>Has {votes[topAnecdoteIndex()]} votes</div>
        </>
      }
    </>
  );
};

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById('root'));