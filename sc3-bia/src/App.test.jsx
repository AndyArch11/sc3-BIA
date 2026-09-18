import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Business Impact Assessment app without crashing', () => {
  expect(() => {
    render(<App />);
  }).not.toThrow();

  expect(screen.getAllByText(/Business Impact Assessment/i).length).toBeGreaterThan(0);
});
