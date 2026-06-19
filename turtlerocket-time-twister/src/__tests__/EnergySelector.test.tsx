import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EnergySelector } from '../components/EnergySelector';
import { initializeEnergyLevels } from '../utils/energyHelpers';
import type { EnergyLevel } from '../types/energy';

function renderSelector(overrides?: {
  energyLevels?: EnergyLevel[];
  onEnergyChange?: jest.Mock;
  onReset?: jest.Mock;
}) {
  const props = {
    energyLevels: overrides?.energyLevels ?? initializeEnergyLevels(),
    onEnergyChange: overrides?.onEnergyChange ?? jest.fn(),
    onReset: overrides?.onReset ?? jest.fn(),
  };
  render(<EnergySelector {...props} />);
  return props;
}

describe('EnergySelector', () => {
  it('renders 12 hour blocks', () => {
    renderSelector();
    const blocks = screen.getAllByRole('listitem');
    expect(blocks).toHaveLength(12);
  });

  it('shows hour labels from 8:00 to 19:00', () => {
    renderSelector();
    expect(screen.getByText('8:00')).toBeInTheDocument();
    expect(screen.getByText('19:00')).toBeInTheDocument();
  });

  it('calls onEnergyChange with cycled level when a block is clicked', async () => {
    const user = userEvent.setup();
    const onEnergyChange = jest.fn();
    renderSelector({ onEnergyChange });

    const blocks = screen.getAllByRole('listitem');
    await user.click(blocks[0]);

    expect(onEnergyChange).toHaveBeenCalledWith(0, 'high');
  });

  it('cycles medium → high on click', async () => {
    const user = userEvent.setup();
    const onEnergyChange = jest.fn();
    renderSelector({ onEnergyChange });

    await user.click(screen.getAllByRole('listitem')[0]);
    expect(onEnergyChange).toHaveBeenCalledWith(0, 'high');
  });

  it('cycles high → low on click', async () => {
    const user = userEvent.setup();
    const onEnergyChange = jest.fn();
    const levels = initializeEnergyLevels();
    levels[0] = 'high';
    renderSelector({ energyLevels: levels, onEnergyChange });

    await user.click(screen.getAllByRole('listitem')[0]);
    expect(onEnergyChange).toHaveBeenCalledWith(0, 'low');
  });

  it('calls onReset when reset button is clicked', async () => {
    const user = userEvent.setup();
    const onReset = jest.fn();
    renderSelector({ onReset });

    await user.click(screen.getByRole('button', { name: /reset to default/i }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('blocks are keyboard accessible via Enter', async () => {
    const user = userEvent.setup();
    const onEnergyChange = jest.fn();
    renderSelector({ onEnergyChange });

    const firstBlock = screen.getAllByRole('listitem')[0];
    firstBlock.focus();
    await user.keyboard('{Enter}');

    expect(onEnergyChange).toHaveBeenCalled();
  });

  it('displays energy emoji for each block', () => {
    renderSelector();
    // All 12 start as medium — 😐
    const emojis = screen.getAllByText('😐');
    expect(emojis).toHaveLength(12);
  });

  it('aria-label includes the energy level', () => {
    renderSelector();
    expect(screen.getByLabelText('8:00 — medium energy')).toBeInTheDocument();
  });
});
