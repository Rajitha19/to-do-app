import axios, { AxiosResponse } from 'axios';
import { Task, CreateTaskDto, ApiResponse } from '../types/task.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    // Handle network errors
    if (!error.response) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    // Handle API errors
    const errorMessage = error.response.data?.message || error.response.data?.error || 'Something went wrong';
    throw new Error(errorMessage);
  }
);

export class TaskService {
  /**
   * Get the 5 most recent incomplete tasks
   */
  static async getTasks(): Promise<Task[]> {
    try {
      const response: AxiosResponse<ApiResponse<Task[]>> = await apiClient.get('/tasks');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  /**
   * Create a new task
   */
  static async createTask(taskData: CreateTaskDto): Promise<Task> {
    try {
      const response: AxiosResponse<ApiResponse<Task>> = await apiClient.post('/tasks', taskData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  /**
   * Mark a task as completed
   */
  static async completeTask(taskId: number): Promise<Task> {
    try {
      const response: AxiosResponse<ApiResponse<Task>> = await apiClient.put(`/tasks/${taskId}/complete`);
      return response.data.data;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }
}
