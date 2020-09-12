const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

// get all blogs
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

// get single blog
blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    res.json(blog);
  } else {
    res.status(400).end();
  }
});

// add new blog
blogsRouter.post('/', async (req, res) => {
  const body = req.body;
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({
      error: 'token missing or invalid'
    });
  }

  const user = await User.findById(decodedToken.id);

  if (!body.title || !body.author || !body.url) {
    return res.status(400).json({
      error: 'content missing'
    });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.json(savedBlog);
});

// delete blog
blogsRouter.delete('/:id', async (req, res) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({
      error: 'token missing or invalid'
    });
  }

  const user = await User.findById(decodedToken.id);
  const blog = await Blog.findById(req.params.id);

  if (blog.user.toString() !== user._id.toString()) {
    return res.status(401).json({
      error: 'blog can be deleted only by user who created it'
    });
  }

  await Blog.findByIdAndRemove(req.params.id);
  user.blogs = user.blogs.filter(b => b._id.toString() !== req.params.id);
  await user.save();
  res.status(204).end();
});

// update blog
blogsRouter.put('/:id', async (req, res) => {
  const body = req.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  };

  const updatedNote = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true });
  res.json(updatedNote);
});

module.exports = blogsRouter;