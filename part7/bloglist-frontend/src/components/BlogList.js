import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const blogs = useSelector(state => state.blogs)
    .sort((a, b) => b.likes - a.likes);

  return (
    <>
      <h2>Blogs</h2>
      <ul>
        {blogs.map(blog =>
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> by {blog.author}
          </li>
        )}
      </ul>
    </>
  );
};

export default BlogList;