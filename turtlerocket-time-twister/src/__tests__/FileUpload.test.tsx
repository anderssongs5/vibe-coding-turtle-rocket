import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUpload } from '../components/FileUpload';

function makeFile(name = 'test.ics', type = 'text/calendar') {
  return new File(['BEGIN:VCALENDAR\r\nEND:VCALENDAR'], name, { type });
}

function renderUpload(overrides?: {
  onFileSelect?: jest.Mock;
  isProcessing?: boolean;
  error?: string | null;
  selectedFileName?: string | null;
  onClear?: jest.Mock;
}) {
  const props = {
    onFileSelect: overrides?.onFileSelect ?? jest.fn(),
    isProcessing: overrides?.isProcessing ?? false,
    error: overrides?.error ?? null,
    selectedFileName: overrides?.selectedFileName ?? null,
    onClear: overrides?.onClear ?? jest.fn(),
  };
  render(<FileUpload {...props} />);
  return props;
}

describe('FileUpload', () => {
  it('renders the file input', () => {
    renderUpload();
    expect(screen.getByLabelText(/choose an .ics file/i)).toBeInTheDocument();
  });

  it('calls onFileSelect when a file is selected', async () => {
    const user = userEvent.setup();
    const onFileSelect = jest.fn();
    renderUpload({ onFileSelect });

    const input = screen.getByLabelText(/choose an .ics file/i);
    await user.upload(input, makeFile());

    expect(onFileSelect).toHaveBeenCalledTimes(1);
    expect(onFileSelect.mock.calls[0][0].name).toBe('test.ics');
  });

  it('shows the selected filename when provided', () => {
    renderUpload({ selectedFileName: 'my-calendar.ics' });
    expect(screen.getByText('my-calendar.ics')).toBeInTheDocument();
  });

  it('calls onClear when the clear button is clicked', async () => {
    const user = userEvent.setup();
    const onClear = jest.fn();
    renderUpload({ selectedFileName: 'my-calendar.ics', onClear });

    await user.click(screen.getByRole('button', { name: /remove file/i }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('displays error message', () => {
    renderUpload({ error: 'Invalid file type' });
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid file type');
  });

  it('does not show clear button when no file is selected', () => {
    renderUpload();
    expect(screen.queryByRole('button', { name: /remove file/i })).not.toBeInTheDocument();
  });

  it('shows processing label when isProcessing is true', () => {
    renderUpload({ isProcessing: true });
    expect(screen.getByText(/processing/i)).toBeInTheDocument();
  });

  it('disables input during processing', () => {
    renderUpload({ isProcessing: true });
    expect(document.getElementById('ics-input')).toBeDisabled();
  });

  it('pressing Escape clears the selected file', () => {
    const onClear = jest.fn();
    renderUpload({ selectedFileName: 'my-calendar.ics', onClear });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
