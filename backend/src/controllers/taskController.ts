import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/taskService';
import { CreateTaskDto } from '../types/task.types';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  /**
   * Get the 5 most recent incomplete tasks
   */
  getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tasks = await this.taskService.getRecentTasks();
      res.status(200).json({
        success: true,
        data: tasks,
        message: 'Tasks retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a new task
   */
  createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskData: CreateTaskDto = req.body;
      const newTask = await this.taskService.createTask(taskData);
      
      res.status(201).json({
        success: true,
        data: newTask,
        message: 'Task created successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mark a task as completed
   */
  completeTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskId = parseInt(req.params.id);
      
      if (isNaN(taskId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid task ID'
        });
        return;
      }

      const updatedTask = await this.taskService.completeTask(taskId);
      
      res.status(200).json({
        success: true,
        data: updatedTask,
        message: 'Task completed successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}
