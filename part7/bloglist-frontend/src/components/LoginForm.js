import React from 'react';
import PropTypes from 'prop-types';

import {
  TextField,
  Button
} from '@material-ui/core';

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {

  const padding = {
    paddingTop: 5,
    paddingBottom: 5
  };

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={padding}>
          <TextField
            label='Username'
            id='username'
            type='text'
            value={username}
            name='Username'
            onChange={handleUsernameChange}
          />
        </div>
        <div style={padding}>
          <TextField
            label='Password'
            id='password'
            type='password'
            value={password}
            name='Password'
            onChange={handlePasswordChange}
          />
        </div>
        <Button id='login-button' size='small' variant='contained' color='primary' type='submit'>Log in</Button>
      </form>
    </>
  );
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
};

export default LoginForm;