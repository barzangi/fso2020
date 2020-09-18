import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Blog from './Blog';

describe('<Blog />', () => {
  let component;
  let blog;
  let user;

  beforeEach(() => {
    blog = {
      title: 'React Patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      user: { username: 'username' }
    };

    user = {
      username: 'username'
    };
  });

  test('content renders includes only title and author (no likes)', () => {
    component = render(
      <Blog blog={blog} user={user} />
    );
    const div = component.container.querySelector('.moreInfoContainer');

    expect(component.container).toHaveTextContent(
      'React Patterns by Michael Chan'
    );
    expect(div).toHaveStyle(
      'display: none'
    );
  });

  test('number of likes is displayed after "show" button is clicked', () => {
    component = render(
      <Blog blog={blog} user={user} />
    );
    const button = component.getByText('show');
    fireEvent.click(button);

    expect(component.container).toHaveTextContent('Likes: 7');
  });

  test('clicking the "Like" button twice calls event handler twice', () => {
    const mockHandler = jest.fn();
    component = render(
      <Blog blog={blog} user={user} addLike={mockHandler} />
    );
    const button = component.getByText('Like');
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});