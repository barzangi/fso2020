import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { like, destroyBlog, addComment } from '../reducers/blogsReducer';
import { setNotification } from '../reducers/notificationReducer';

import {
  TextField,
  Button
} from '@material-ui/core';

const Blog = ({ blog }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.user);

  const [comment, setComment] = useState('');

  if (!blog) return null;

  const deleteStyle = {
    display: blog.user.username === user.username ? '' : 'none'
  };

  const addLike = () => {
    dispatch(like(blog));
  };

  const deleteBlog = () => {
    const confirmDelete = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`);
    if (confirmDelete) {
      dispatch(destroyBlog(blog.id));
      history.push('/');
    }
  };

  const createComment = (event) => {
    event.preventDefault();
    if (comment !== '') {
      dispatch(addComment(blog, comment));
      setComment('');
    } else {
      dispatch(setNotification(
        'Comment field is empty',
        false,
        3
      ));
    }
  };

  const padding = {
    paddingTop: 5,
    paddingBottom: 5
  };

  return (
    <>
      <h2>{blog.title} by {blog.author}</h2>
      <div style={padding}>Visit: <a href={blog.url}>{blog.url}</a></div>
      <div style={padding}>Likes: {blog.likes} <Button id='like' size='small' variant='contained' color='secondary' onClick={addLike}>Like</Button></div>
      <div style={padding}>Posted by {blog.user.name}</div>
      <div style={deleteStyle}>
        <div style={padding}>
          <Button id='delete' size='small' variant='contained' color='secondary' onClick={deleteBlog}>
            Delete
          </Button>
        </div>
      </div>
      <h3>Comments</h3>
      {blog.comments.length === 0
        ? null
        : <ul>
          {blog.comments.map(comment =>
            <li key={comment}>{comment}</li>  
          )}
        </ul>
      }
      <form onSubmit={createComment}>
        <div style={padding}>
          <TextField
            label='New Comment'
            type='text'
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
        </div>
        <Button size='small' variant='contained' color='primary' type='submit'>Add comment</Button>
      </form>
    </>
  );
};

export default Blog;