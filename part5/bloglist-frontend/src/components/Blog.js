import React, { useState } from 'react';

const Blog = ({ blog, addLike, destroyBlog, user }) => {
  const [expand, setExpand] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginTop: 10
  }

  const expandStyle = {
    display: expand ? '' : 'none'
  };

  const deleteStyle = {
    display: blog.user.username === user.username ? '' : 'none'
  };

  return (
    <>
      <div style={blogStyle}>
        <div>
          <a href={blog.url}>{blog.title}</a> by {blog.author}{' '}
          <button onClick={() => setExpand(!expand)}>
            {expand ? 'hide' : 'show'}
          </button>
        </div>
        <div style={expandStyle}>
          <div>Likes: {blog.likes} <button onClick={addLike}>Like</button></div>
          <div>Posted by {blog.user.name}</div>
          <div style={deleteStyle}>
            <button onClick={destroyBlog}>Delete</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;