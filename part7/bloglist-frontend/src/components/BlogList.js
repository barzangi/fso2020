import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { like, destroyBlog } from '../reducers/blogsReducer';

import Blog from './Blog';

const BlogList = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const blogs = useSelector(state => state.blogs)
    .sort((a, b) => b.likes - a.likes);

  const addLike = blog => {
    dispatch(like(blog));
  };

  const deleteBlog = blog => {
    const confirmDelete = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`);
    if (confirmDelete) {
      dispatch(destroyBlog(blog.id));
    }
  };

  return (
    <>
      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          addLike={() => addLike(blog)}
          destroyBlog={() => deleteBlog(blog)}
          user={user}
        />
      )}
    </>
  );
};

export default BlogList;