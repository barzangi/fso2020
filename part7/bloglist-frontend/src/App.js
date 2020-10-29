import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BlogList from './components/BlogList';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import Notification from './components/Notification';

import blogService from './services/blogs';
import loginService from './services/login';

import { setNotification } from './reducers/notificationReducer';
import { initBlogs, newBlog } from './reducers/blogsReducer';
import { setUser } from './reducers/userReducer';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  useEffect(() => {
    dispatch(initBlogs());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token);
      dispatch(setUser(user));
    }
  }, [dispatch, user]);

  const addBlog = async (blogObj) => {
    try {
      blogFormRef.current.toggleVisibility();
      let returnedBlog = await blogService.create(blogObj);
      returnedBlog = {
        ...returnedBlog,
        user: {
          username: user.username,
          name: user.name,
          id: returnedBlog.id
        }
      };
      dispatch(newBlog(returnedBlog));
      dispatch(setNotification(
        `Added new blog "${returnedBlog.title}" by ${returnedBlog.author}`,
        true,
        4
      ));
    } catch (exception) {
      dispatch(setNotification(
        'Content missing',
        false,
        4
      ));
    }
  };

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  );

  const blogFormRef = useRef();

  const blogForm = () => (
    <Togglable buttonLabel='New blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username, password
      });

      window.localStorage.setItem(
        'loggedBlogsAppUser', JSON.stringify(user)
      );
      blogService.setToken(user.token);
      dispatch(setUser(user));
      setUsername('');
      setPassword('');
    } catch (exception) {
      dispatch(setNotification(
        'Wrong username or password',
        false,
        4
      ));
    }
  };

  const handleLogout = () => {
    dispatch(setUser(null));
    window.localStorage.removeItem('loggedBlogsAppUser');
  };

  return (
    <div>
      <h2>Blogs</h2>
      <Notification />
      {user === null
        ? loginForm()
        : <div>
          <p>{user.name} logged in <button id='logout' onClick={() => handleLogout()}>Logout</button></p>
          {blogForm()}
          <BlogList />
        </div>
      }
    </div>
  );
};

export default App;