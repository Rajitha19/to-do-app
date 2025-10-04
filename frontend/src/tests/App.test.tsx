import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import { TaskService } from '../services/taskService';

// Mock the TaskService
jest.mock('../services/taskService');

const mockTaskService = TaskService as jest.Mocked<typeof TaskService>;

const mockTasks = [
  {
    id: 1,
    title: 'Test Task 1',
    description: 'Test Description 1',
    completed: false,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Test Task 2',
    description: 'Test Description 2',
    completed: false,
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
];

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders app title and form', async () => {
    mockTaskService.getTasks.mockResolvedValue(mockTasks);

    render(<App />);

    expect(screen.getByText('Todo Application')).toBeInTheDocument();
    expect(screen.getByText('Add a Task')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter task description (optional)')
    ).toBeInTheDocument();
  });

  test('loads and displays tasks on mount', async () => {
    mockTaskService.getTasks.mockResolvedValue(mockTasks);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });

    expect(mockTaskService.getTasks).toHaveBeenCalledTimes(1);
  });

  test('displays empty state when no tasks', async () => {
    mockTaskService.getTasks.mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
      expect(
        screen.getByText('Get started by creating your first task above.')
      ).toBeInTheDocument();
    });
  });

  test('creates a new task', async () => {
    const newTask = {
      id: 3,
      title: 'New Task',
      description: 'New Description',
      completed: false,
      createdAt: '2023-01-03T00:00:00Z',
      updatedAt: '2023-01-03T00:00:00Z',
    };

    mockTaskService.getTasks
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([newTask]);
    mockTaskService.createTask.mockResolvedValue(newTask);

    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    });

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Enter task title'), {
      target: { value: 'New Task' },
    });
    fireEvent.change(
      screen.getByPlaceholderText('Enter task description (optional)'),
      {
        target: { value: 'New Description' },
      }
    );

    // Submit the form
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(mockTaskService.createTask).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description',
      });
    });

    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });
  });

  test('completes a task', async () => {
    mockTaskService.getTasks.mockResolvedValue(mockTasks);
    mockTaskService.completeTask.mockResolvedValue(mockTasks[0]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    // Click the Done button for the first task
    const doneButtons = screen.getAllByText('Done');
    fireEvent.click(doneButtons[0]);

    await waitFor(() => {
      expect(mockTaskService.completeTask).toHaveBeenCalledWith(1);
    });

    // Task should be removed from the list
    await waitFor(() => {
      expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument();
    });
  });

  test('displays error when task loading fails', async () => {
    mockTaskService.getTasks.mockRejectedValue(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  test('retries loading tasks after error', async () => {
    mockTaskService.getTasks
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockTasks);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    // Click retry button
    fireEvent.click(screen.getByText('Retry'));

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    expect(mockTaskService.getTasks).toHaveBeenCalledTimes(2);
  });

  test('dismisses error message', async () => {
    mockTaskService.getTasks.mockRejectedValue(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    // Click dismiss button (×)
    fireEvent.click(screen.getByText('×'));

    await waitFor(() => {
      expect(screen.queryByText('Network error')).not.toBeInTheDocument();
    });
  });
});
