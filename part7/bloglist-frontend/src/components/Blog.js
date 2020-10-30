import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { like, destroyBlog, addComment } from '../reducers/blogsReducer';
import { setNotification } from '../reducers/notificationReducer';

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
    }
    history.push('/');
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

  return (
    <>
      <h2>{blog.title} by {blog.author}</h2>
      <div>Visit: <a href={blog.url}>{blog.url}</a></div>
      <div>Likes: {blog.likes} <button id='like' onClick={addLike}>Like</button></div>
      <div>Posted by {blog.user.name}</div>
      <div style={deleteStyle}>
        <button id='delete' onClick={deleteBlog}>Delete</button>
      </div>
      <h3>Comments</h3>
      <form onSubmit={createComment}>
        <input
          type='text'
          value={comment}
          onChange={({ target }) => setComment(target.value)} />{' '}
        <button type='submit'>Add comment</button>
      </form>
      {blog.comments.length === 0
        ? null
        : <ul>
          {blog.comments.map(comment =>
            <li key={comment}>{comment}</li>  
          )}
        </ul>
      }
    </>
  );
};

export default Blog;