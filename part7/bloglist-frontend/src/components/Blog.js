import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { like, destroyBlog } from '../reducers/blogsReducer';

const Blog = ({ blog }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.user);

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

  return (
    <>
      <h2>{blog.title} by {blog.author}</h2>
      <div>Visit: <a href={blog.url}>{blog.url}</a></div>
      <div>Likes: {blog.likes} <button id='like' onClick={addLike}>Like</button></div>
      <div>Posted by {blog.user.name}</div>
      <div style={deleteStyle}>
        <button id='delete' onClick={deleteBlog}>Delete</button>
      </div>
    </>
  );
};

export default Blog;