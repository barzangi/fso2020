const reducer = (state = [], action) => {
  switch (action.type) {
    case 'VOTE':
      const id = action.data.id;
      const votedAnecdote = state.find(anecdote => anecdote.id === id);
      const changedAnecdote = {
        ...votedAnecdote,
        votes: votedAnecdote.votes + 1
      };
      return state.map(anecdote => anecdote.id !== id ? anecdote : changedAnecdote);
    case 'ADD_ANECDOTE':
      return [...state, action.data];
    case 'INIT_ANECDOTES':
      return action.data;
    default:
      return state;
  }
};

export const initAnecdotes = (anecdotes) => {
  return {
    type: 'INIT_ANECDOTES',
    data: anecdotes
  };
};

export const vote = (id) => {
  return {
    type: 'VOTE',
    data: { id }
  };
};

export const createAnecdote = (data) => {
  return {
    type: 'ADD_ANECDOTE',
    data
  };
};

export default reducer;