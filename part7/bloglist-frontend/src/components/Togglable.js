import React, { useState, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import {
  Button
} from '@material-ui/core';

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    };
  });

  const buttonStyle = {
    marginTop: 5,
    marginBottom: 5
  };

  return (
    <>
      <div style={hideWhenVisible}>
        <Button
          size='small'
          onClick={toggleVisibility}
          variant='contained'
          color='primary'
        >
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button
          style={buttonStyle}
          size='small'
          onClick={toggleVisibility}
          variant='contained'
          color='primary'
        >
          Cancel
        </Button>
      </div>
    </>
  );
});

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
};

Togglable.displayName = 'Togglable';

export default Togglable;