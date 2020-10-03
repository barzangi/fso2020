import anecdoteService from '../services/anecdotes';

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

export const initAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll();
    dispatch ({
      type: 'INIT_ANECDOTES',
      data: anecdotes
    });
  };
};

export const vote = (anecdote) => {
  return async dispatch => {
    const changedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    };
    await anecdoteService.updateAnecdote(anecdote.id, changedAnecdote);
    dispatch({
      type: 'VOTE',
      data: { id: anecdote.id }
    });
  };
};

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createAnecdote(content);
    dispatch({
      type: 'ADD_ANECDOTE',
      data: newAnecdote
    });
  };
};

export default reducer;