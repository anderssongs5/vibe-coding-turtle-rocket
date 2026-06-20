import React from 'react';
import { render, screen } from '@testing-library/react';
import { EnergySelector } from '../components/EnergySelector';
import App from '../App';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe('Responsive layout structure', () => {
  it('EnergySelector renders 12 items in a list grid', () => {
    const noop = jest.fn();
    render(
      <EnergySelector
        energyLevels={Array.from({ length: 12 }, () => 'medium' as const)}
        onEnergyChange={noop}
        onReset={noop}
      />
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(12);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('App renders with wrapper and container structure', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.app-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.app-container')).toBeInTheDocument();
  });

  it('App renders heading, subtitle, and instructions', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /turtlerocket time twister/i })).toBeInTheDocument();
    // subtitle appears once; instructions list items also contain this phrase — use getAllByText
    expect(screen.getAllByText(/set your energy levels/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/upload your calendar/i)).toBeInTheDocument();
  });

  it('App renders the sample calendar download link', () => {
    render(<App />);
    const link = screen.getByRole('link', { name: /download a sample calendar/i });
    expect(link).toHaveAttribute('download', 'sample.ics');
  });

  it('App renders energy selector and file upload sections', () => {
    render(<App />);
    expect(screen.getByRole('region', { name: /energy levels/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /calendar file upload/i })).toBeInTheDocument();
  });
});
