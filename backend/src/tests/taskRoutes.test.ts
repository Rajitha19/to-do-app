import request from 'supertest';
import app from '../index';
import { TaskService } from '../services/taskService';

// Mock the TaskService
jest.mock('../services/taskService');

const mockTaskService = TaskService as jest.MockedClass<typeof TaskService>;

describe('Task Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    it('should return the 5 most recent tasks', async () => {
      const mockTasks = [
        {
          id: 1,
          title: 'Test Task 1',
          description: 'Test Description 1',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Test Task 2',
          description: 'Test Description 2',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockTaskService.prototype.getRecentTasks.mockResolvedValue(mockTasks);

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockTasks);
      expect(mockTaskService.prototype.getRecentTasks).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when fetching tasks', async () => {
      mockTaskService.prototype.getRecentTasks.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with valid data', async () => {
      const newTaskData = {
        title: 'New Task',
        description: 'New Task Description',
      };

      const mockCreatedTask = {
        id: 1,
        title: newTaskData.title,
        description: newTaskData.description,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskService.prototype.createTask.mockResolvedValue(mockCreatedTask);

      const response = await request(app)
        .post('/api/tasks')
        .send(newTaskData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockCreatedTask);
      expect(mockTaskService.prototype.createTask).toHaveBeenCalledWith(newTaskData);
    });

    it('should reject task creation with invalid data', async () => {
      const invalidTaskData = {
        title: '', // Empty title should be rejected
        description: 'Valid description',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(invalidTaskData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject task creation without title', async () => {
      const invalidTaskData = {
        description: 'Valid description',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(invalidTaskData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/tasks/:id/complete', () => {
    it('should mark a task as completed', async () => {
      const taskId = 1;
      const mockCompletedTask = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskService.prototype.completeTask.mockResolvedValue(mockCompletedTask);

      const response = await request(app).put(`/api/tasks/${taskId}/complete`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockCompletedTask);
      expect(mockTaskService.prototype.completeTask).toHaveBeenCalledWith(taskId);
    });

    it('should handle invalid task ID', async () => {
      const response = await request(app).put('/api/tasks/invalid/complete');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid task ID');
    });

    it('should handle task not found', async () => {
      const taskId = 999;
      mockTaskService.prototype.completeTask.mockRejectedValue(new Error('Task not found'));

      const response = await request(app).put(`/api/tasks/${taskId}/complete`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });
});
