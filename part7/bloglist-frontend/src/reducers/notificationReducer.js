const initialState = {
  message: null,
  kind: true
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return action.data;
  default:
    return state;
  }
};

let timeoutId;

export const setNotification = (message, kind, delay) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: {
        message: message,
        kind: kind
      }
    });
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      dispatch({
        type: 'SET_NOTIFICATION',
        data: {
          message: null,
          kind: false
        }
      });
    }, delay * 1000);
  };
};

export default notificationReducer;