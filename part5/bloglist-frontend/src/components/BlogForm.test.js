import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BlogForm from './BlogForm';

test('<BlogForm /> calls onSubmit and updates parent state with correct field values', () => {
  const createBlog = jest.fn();

  const component = render(
    <BlogForm createBlog={createBlog} />
  );

  const title = component.container.querySelector('#title');
  const author = component.container.querySelector('#author');
  const url = component.container.querySelector('#url');
  const form = component.container.querySelector('form');

  fireEvent.change(title, {
    target: { value: 'React Patterns' }
  });
  fireEvent.change(author, {
    target: { value: 'Michael Chan' }
  });
  fireEvent.change(url, {
    target: { value: 'https://reactpatterns.com/' }
  });
  fireEvent.submit(form);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe('React Patterns');
  expect(createBlog.mock.calls[0][0].author).toBe('Michael Chan');
  expect(createBlog.mock.calls[0][0].url).toBe('https://reactpatterns.com/');
});