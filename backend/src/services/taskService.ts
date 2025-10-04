import { PrismaClient, Task } from '@prisma/client';
import { CreateTaskDto } from '../types/task.types';

export class TaskService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Get the 5 most recent incomplete tasks
   */
  async getRecentTasks(): Promise<Task[]> {
    try {
      const tasks = await this.prisma.task.findMany({
        where: {
          completed: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      });

      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  }

  /**
   * Create a new task
   */
  async createTask(taskData: CreateTaskDto): Promise<Task> {
    try {
      const newTask = await this.prisma.task.create({
        data: {
          title: taskData.title.trim(),
          description: taskData.description?.trim() || null,
          completed: false,
        },
      });

      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  }

  /**
   * Mark a task as completed
   */
  async completeTask(taskId: number): Promise<Task> {
    try {
      // Check if task exists
      const existingTask = await this.prisma.task.findUnique({
        where: { id: taskId },
      });

      if (!existingTask) {
        throw new Error('Task not found');
      }

      if (existingTask.completed) {
        throw new Error('Task is already completed');
      }

      // Update task to completed
      const updatedTask = await this.prisma.task.update({
        where: { id: taskId },
        data: { completed: true },
      });

      return updatedTask;
    } catch (error) {
      console.error('Error completing task:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to complete task');
    }
  }

  /**
   * Get all tasks (for testing purposes)
   */
  async getAllTasks(): Promise<Task[]> {
    try {
      return await this.prisma.task.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error fetching all tasks:', error);
      throw new Error('Failed to fetch all tasks');
    }
  }

  /**
   * Delete a task (for testing purposes)
   */
  async deleteTask(taskId: number): Promise<void> {
    try {
      await this.prisma.task.delete({
        where: { id: taskId },
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  }
}
