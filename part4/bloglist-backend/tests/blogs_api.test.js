const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog));
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
});

test('all notes are returned in json format', async () => {
  const response = await api.get('/api/blogs');
  expect(200);
  expect('application/json');
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('blog post unique identifier is id', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body[0].id).toBeDefined();
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map(b => b.title);
  expect(titles).toContain(
    'Type wars'
  );
});

test('if likes property missing from request, default to 0', async () => {
  const newBlog = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
  };

  await api
    .post('/api/blogs')
    .send(newBlog);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd[blogsAtEnd.length -1].likes).toBe(0);
});

test('if title and url properties misssing from request, return error status 400', async () => {
  const newBlog = {
    author: 'Robert C. Martin',
    likes: 2
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);
});

afterAll(() => {
  mongoose.connection.close();
});