const notificationReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.notification;
    case 'CLEAR_NOTIFICATION':
      return action.notification;
    default:
      return state;
  }
};

export const setNotification = content => {
  return {
    type: 'SET_NOTIFICATION',
    notification: `You voted "${content}"`
  };
};

export const clearNotification = () => {
  return {
    type: 'CLEAR_NOTIFICATION',
    notification: ''
  };
};

export default notificationReducer;