import blogService from '../services/blogs';

const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_BLOGS':
    return action.data;
  case 'NEW_BLOG':
    return [...state, action.data];
  case 'LIKE': {
    const id = action.data.id;
    const likedBlog = state.find(blog => blog.id === id);
    const changedBlog = {
      ...likedBlog,
      likes: likedBlog.likes + 1
    };
    return state.map(blog => blog.id === id ? changedBlog : blog);
  }
  case 'DESTROY_BLOG':
    return state.filter(blog => blog.id !== action.data.id);
  case 'ADD_COMMENT':
    const id = action.data.id;
    const commentedBlog = state.find(blog => blog.id === id);
    const changedBlog = {
      ...commentedBlog,
      comments: commentedBlog.comments.concat(action.data.newComment)
    };
    return state.map(blog => blog.id === id ? changedBlog : blog);
  default:
    return state;
  }
};

export const initBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll();
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    });
  };
};

export const newBlog = (newBlog) => {
  return async dispatch => {
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog
    });
  };
};

export const like = (blog) => {
  return async dispatch => {
    const likedBlog = {
      ...blog,
      likes: blog.likes + 1
    };
    await blogService.update(blog.id, likedBlog);
    dispatch({
      type: 'LIKE',
      data: { id: blog.id }
    });
  };
};

export const destroyBlog = (id) => {
  return async dispatch => {
    await blogService.destroy(id);
    dispatch({
      type: 'DESTROY_BLOG',
      data: { id }
    });
  };
};

export const addComment = (blog, newComment) => {
  return async dispatch => {
    const newObj = { ...blog, comments: blog.comments.concat(newComment) };
    await blogService.addComment(blog.id, newObj);
    dispatch({
      type: 'ADD_COMMENT',
      data: {
        id: blog.id,
        newComment: newComment
      }
    });
  };
};

export default blogReducer;