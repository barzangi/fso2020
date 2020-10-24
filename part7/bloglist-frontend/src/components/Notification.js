import React from 'react';
import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector(state => state.notification);

  if (notification.message === null) return null;
  const style = {
    color: notification.kind === true ? 'green' : 'red'
  };

  return (
    <div className='message' style={style}>
      {notification.message}
    </div>
  );
};

export default Notification;