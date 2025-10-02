import { TaskService } from '../services/taskService';
import { CreateTaskDto } from '../types/task.types';
import { mockPrisma } from './setup';

// Mock the PrismaClient
jest.mock('@prisma/client');

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
    jest.clearAllMocks();
  });

  describe('getRecentTasks', () => {
    it('should return the 5 most recent incomplete tasks', async () => {
      const mockTasks = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          completed: false,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Description 2',
          completed: false,
          createdAt: new Date('2023-01-02'),
          updatedAt: new Date('2023-01-02'),
        },
      ];

      (mockPrisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks);

      const result = await taskService.getRecentTasks();

      expect(result).toEqual(mockTasks);
      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: { completed: false },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
    });

    it('should handle database errors', async () => {
      (mockPrisma.task.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(taskService.getRecentTasks()).rejects.toThrow('Failed to fetch tasks');
    });
  });

  describe('createTask', () => {
    it('should create a new task with valid data', async () => {
      const taskData: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
      };

      const mockCreatedTask = {
        id: 1,
        title: taskData.title,
        description: taskData.description,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.task.create as jest.Mock).mockResolvedValue(mockCreatedTask);

      const result = await taskService.createTask(taskData);

      expect(result).toEqual(mockCreatedTask);
      expect(mockPrisma.task.create).toHaveBeenCalledWith({
        data: {
          title: taskData.title,
          description: taskData.description,
          completed: false,
        },
      });
    });

    it('should handle empty description', async () => {
      const taskData: CreateTaskDto = {
        title: 'New Task',
        description: '',
      };

      const mockCreatedTask = {
        id: 1,
        title: taskData.title,
        description: null,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.task.create as jest.Mock).mockResolvedValue(mockCreatedTask);

      const result = await taskService.createTask(taskData);

      expect(mockPrisma.task.create).toHaveBeenCalledWith({
        data: {
          title: taskData.title,
          description: null,
          completed: false,
        },
      });
    });

    it('should handle database errors during creation', async () => {
      const taskData: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
      };

      (mockPrisma.task.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(taskService.createTask(taskData)).rejects.toThrow('Failed to create task');
    });
  });

  describe('completeTask', () => {
    it('should mark an existing incomplete task as completed', async () => {
      const taskId = 1;
      const existingTask = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const completedTask = { ...existingTask, completed: true };

      (mockPrisma.task.findUnique as jest.Mock).mockResolvedValue(existingTask);
      (mockPrisma.task.update as jest.Mock).mockResolvedValue(completedTask);

      const result = await taskService.completeTask(taskId);

      expect(result).toEqual(completedTask);
      expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: taskId },
      });
      expect(mockPrisma.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: { completed: true },
      });
    });

    it('should throw error when task does not exist', async () => {
      const taskId = 999;

      (mockPrisma.task.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(taskService.completeTask(taskId)).rejects.toThrow('Task not found');
    });

    it('should throw error when task is already completed', async () => {
      const taskId = 1;
      const completedTask = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.task.findUnique as jest.Mock).mockResolvedValue(completedTask);

      await expect(taskService.completeTask(taskId)).rejects.toThrow('Task is already completed');
    });

    it('should handle database errors during update', async () => {
      const taskId = 1;
      const existingTask = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.task.findUnique as jest.Mock).mockResolvedValue(existingTask);
      (mockPrisma.task.update as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(taskService.completeTask(taskId)).rejects.toThrow('Database error');
    });
  });
});
