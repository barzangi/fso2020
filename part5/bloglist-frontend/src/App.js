import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';

import blogService from './services/blogs';
import loginService from './services/login';

const Notification = ({ message, type }) => {
  if (message === null) return null;
  const style = {
    color: type === true ? 'green' : 'red'
  }
  return (
    <div className='message' style={style}>
      {message}
    </div>
  );
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    );
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

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
      setBlogs(blogs.concat(returnedBlog));
      setNotificationMessage(`Added new blog "${returnedBlog.title}" by ${returnedBlog.author}`);
      setNotificationType(true);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 4000);
    } catch (exception) {
      setNotificationMessage('Content missing');
      setNotificationType(false);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 4000);
    };
  };

  const addLike = async id => {
    const blog = blogs.find(b => b.id === id);
    const changedBlog = {
      ...blog,
      likes: blog.likes + 1
    };

    await blogService.update(id, changedBlog);
    setBlogs(blogs.map(b => b.id !== id ? b : changedBlog).sort((a, b) => b.likes - a.likes));
  };

  const destroyBlog = async blog => {
    const confirmDelete = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`);
    if (confirmDelete) {
      await blogService.destroy(blog.id);
      setBlogs(blogs.filter(b => b.id !== blog.id));
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
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setNotificationMessage('Wrong username or password');
      setNotificationType(false);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 4000);
    };
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('loggedBlogsAppUser');
  };

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notificationMessage} type={notificationType} />
      {user === null
        ? loginForm()
        : <div>
            <p>{user.name} logged in <button onClick={() => handleLogout()}>Logout</button></p>
            {blogForm()}
            {blogs.map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                addLike={() => addLike(blog.id)}
                destroyBlog={() => destroyBlog(blog)}
                user={user}
              />
            )}
          </div>
      }
    </div>
  );
};

export default App;