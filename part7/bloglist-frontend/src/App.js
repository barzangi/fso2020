import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom';

import BlogList from './components/BlogList';
import UserList from './components/UserList';
import User from './components/User';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import Notification from './components/Notification';

import blogService from './services/blogs';
import loginService from './services/login';

import { setNotification } from './reducers/notificationReducer';
import { initBlogs, newBlog } from './reducers/blogsReducer';
import { setUser } from './reducers/userReducer';
import { initUsers } from './reducers/usersReducer';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const users = useSelector(state => state.users);
  const blogs = useSelector(state => state.blogs);

  useEffect(() => {
    dispatch(initBlogs());
    dispatch(initUsers());
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, [dispatch]);

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

  const padding = {
    padding: 5
  };

  const userMatch = useRouteMatch('/users/:id');
  const matchedUser = userMatch
    ? users.find(user => user.id === userMatch.params.id)
    : null;

  const blogMatch = useRouteMatch('/blogs/:id');
  const matchedBlog = blogMatch
    ? blogs.find(blog => blog.id === blogMatch.params.id)
    : null;

  return (
    <>
      <h1>Blogs App</h1>
      <Notification />
      {user === null
        ? loginForm()
        : <div>
          <Link style={padding} to='/'>Home</Link>
          <Link style={padding} to='/users'>Users</Link>
          <p>{user.name} logged in <button id='logout' onClick={() => handleLogout()}>Logout</button></p>
          <Switch>
            <Route path='/users/:id'>
              <User user={matchedUser} />
            </Route>
            <Route path='/blogs/:id'>
              <Blog blog={matchedBlog} />
            </Route>
            <Route path='/users'>
              <UserList />
            </Route>
            <Route path='/'>
              {blogForm()}
              <BlogList />
            </Route>
          </Switch>
        </div>
      }
    </>
  );
};

export default App;