import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders TurtleRocket Time Twister heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /turtlerocket time twister/i });
  expect(heading).toBeInTheDocument();
});

test('renders the app container', () => {
  const { container } = render(<App />);
  const appContainer = container.querySelector('.app-container');
  expect(appContainer).toBeInTheDocument();
});
