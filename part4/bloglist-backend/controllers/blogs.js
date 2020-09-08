const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

// get all blogs
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

// add new blog
blogsRouter.post('/', async (req, res) => {
  const body = req.body;

  if (!body.title || !body.author || !body.url) {
    return res.status(400).json({
      error: 'content missing'
    });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  });

  const savedBlog = await blog.save();
  res.json(savedBlog);
});

module.exports = blogsRouter;