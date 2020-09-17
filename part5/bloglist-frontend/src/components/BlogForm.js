import React, { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = event => {
    event.preventDefault();
    createBlog({
      title: title,
      author: author,
      url: url
    });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <>
      <h2>Create new blog</h2>
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
    </>
  );
};

export default BlogForm;