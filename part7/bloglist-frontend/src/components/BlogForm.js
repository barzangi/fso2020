import React, { useState } from 'react';

import {
  TextField,
  Button
} from '@material-ui/core';

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

  const padding = {
    paddingTop: 5,
    paddingBottom: 5
  };

  return (
    <>
      <h2>Create new blog</h2>
      <form onSubmit={addBlog}>
        <div style={padding}>
          <TextField
            label='Title'
            id='title'
            type='text'
            value={title}
            name='Title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div style={padding}>
          <TextField
            label='Author'
            id='author'
            type='text'
            value={author}
            name='Author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div style={padding}>
          <TextField
            label='URL'
            id='url'
            type='text'
            value={url}
            name='URL'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <Button size='small' variant='contained' color='primary' type='submit'>Save</Button>
      </form>
    </>
  );
};

export default BlogForm;