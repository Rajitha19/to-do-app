import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '../components/TaskForm';

describe('TaskForm Component', () => {
  test('renders form fields', () => {
    const mockOnSubmit = jest.fn();

    render(<TaskForm onSubmit={mockOnSubmit} isLoading={false} />);

    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  test('validates required title field', async () => {
    const mockOnSubmit = jest.fn();

    render(<TaskForm onSubmit={mockOnSubmit} isLoading={false} />);

    // Try to submit without title
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('validates title length', async () => {
    const mockOnSubmit = jest.fn();

    render(<TaskForm onSubmit={mockOnSubmit} isLoading={false} />);

    // Enter a title that's too long
    const longTitle = 'a'.repeat(256);
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: longTitle },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(
      screen.getByText('Title cannot exceed 255 characters')
    ).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('validates description length', async () => {
    const mockOnSubmit = jest.fn();

    render(<TaskForm onSubmit={mockOnSubmit} isLoading={false} />);

    // Enter valid title and long description
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Valid Title' },
    });

    const longDescription = 'a'.repeat(1001);
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: longDescription },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(
      screen.getByText('Description cannot exceed 1000 characters')
    ).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('submits form with valid data', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);

    render(<TaskForm onSubmit={mockOnSubmit} isLoading={false} />);

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Task' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Test Description' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Test Description',
    });
  });

  test('submits form without description', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);

    render(<TaskForm onSubmit={mockOnSubmit} isLoading={false} />);

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Task' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Task',
      description: undefined,
    });
  });

  test('disables form when loading', () => {
    const mockOnSubmit = jest.fn();

    render(<TaskForm onSubmit={mockOnSubmit} isLoading={true} />);

    expect(screen.getByLabelText('Title')).toBeDisabled();
    expect(screen.getByLabelText('Description')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Adding...' })).toBeDisabled();
  });

  test('clears form after successful submission', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);

    render(<TaskForm onSubmit={mockOnSubmit} isLoading={false} />);

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');

    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Test Description' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    // Wait for form to be cleared
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(titleInput).toHaveValue('');
    expect(descriptionInput).toHaveValue('');
  });

  test('clears validation errors when user starts typing', () => {
    const mockOnSubmit = jest.fn();

    render(<TaskForm onSubmit={mockOnSubmit} isLoading={false} />);

    // Submit empty form to trigger validation error
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByText('Title is required')).toBeInTheDocument();

    // Start typing in title field
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'T' },
    });

    // Error should be cleared
    expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
  });
});
