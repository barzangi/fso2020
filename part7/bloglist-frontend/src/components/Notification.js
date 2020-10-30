import React from 'react';
import { useSelector } from 'react-redux';

import { Alert } from '@material-ui/lab';

const Notification = () => {
  const notification = useSelector(state => state.notification);

  if (notification.message === null) return null;

  const severity = notification.kind ? 'success' : 'error';

  const bottomMargin = {
    marginBottom: 5
  };

  return (
    <Alert style={bottomMargin} severity={severity} variant='filled'>
      {notification.message}
    </Alert>
  );
};

export default Notification;