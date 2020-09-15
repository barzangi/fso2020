import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
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
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
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

  const addBlog = async (event) => {
    event.preventDefault();
    const blogObj = {
      title: title,
      author: author,
      url: url
    };

    const returnedBlog = await blogService.create(blogObj);
    setBlogs(blogs.concat(returnedBlog));
    setTitle('');
    setAuthor('');
    setUrl('');
    setNotificationMessage(`Added new blog "${returnedBlog.title}" by ${returnedBlog.author}`);
    setNotificationType(true);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 4000);
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        Username{' '}
          <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
          />
      </div>
      <div>
        Password{' '}
          <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
          />
      </div>
      <button type='submit'>Login</button>
    </form>
  );

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        Title{' '}
        <input
        type='text'
        value={title}
        name='Title'
        onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        Author{' '}
        <input
        type='text'
        value={author}
        name='Author'
        onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        URL{' '}
        <input
        type='text'
        value={url}
        name='URL'
        onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type='submit'>Save</button>
    </form>
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
          </div>
      }
      <ul>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </ul>
    </div>
  );
};

export default App;