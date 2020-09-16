import React from 'react';

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username{' '}
          <input
          type='text'
          value={username}
          name='Username'
          onChange={handleUsernameChange}
          />
        </div>
        <div>
          password{' '}
          <input
          type='password'
          value={password}
          name='Password'
          onChange={handlePasswordChange}
          />
        </div>
        <button type='submit'>Log in</button>
      </form>
    </>
  );
};

export default LoginForm;