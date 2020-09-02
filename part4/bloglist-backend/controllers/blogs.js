const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

// get all blogs
blogsRouter.get('/', (req, res) => {
  Blog
    .find({})
    .then(blogs => {
      res.json(blogs);
    });
});

// add new blog
blogsRouter.post('/', (req, res, next) => {
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
    likes: 0
  });

  blog
    .save()
    .then(savedBlog => savedBlog.toJSON())
    .then(savedAndFormattedBlog => {
      res.json(savedAndFormattedBlog);
    })
    .catch(error => next(error));
});

module.exports = blogsRouter;