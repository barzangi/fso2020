const notificationReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.notification;
    default:
      return state;
  }
};

export const setNotification = (message, delay) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      notification: `You voted "${message}"`
    });
    setTimeout(() => {
      dispatch({
        type: 'SET_NOTIFICATION',
        notification: ''
      });
    }, delay * 1000);
  };
};

export default notificationReducer;