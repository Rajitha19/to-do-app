import React, { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskDto } from './types/task.types';
import { TaskService } from './services/taskService';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from the API
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTasks = await TaskService.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch tasks';
      setError(errorMessage);
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle task creation
  const handleCreateTask = async (taskData: CreateTaskDto): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError(null);
      await TaskService.createTask(taskData);
      // Refresh the task list after successful creation
      await fetchTasks();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create task';
      setError(errorMessage);
      throw error; // Re-throw to handle in the form component
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle task completion
  const handleCompleteTask = async (taskId: number): Promise<void> => {
    try {
      setError(null);
      await TaskService.completeTask(taskId);
      // Remove the completed task from the list immediately
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to complete task';
      setError(errorMessage);
      console.error('Error completing task:', error);
    }
  };

  // Retry function for error states
  const handleRetry = () => {
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl floating-element"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl floating-element" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-6 floating-element">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold gradient-text mb-4 text-shadow">
            Todo Application
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Organize your life with our beautiful and intuitive task management system
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="glass-card border-l-4 border-red-400 mb-8 glow">
            <div className="flex items-center justify-between">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleRetry}
                  className="text-red-800 hover:text-red-600 font-semibold text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded-lg transition-all duration-200"
                >
                  Retry
                </button>
                <button
                  onClick={() => setError(null)}
                  className="text-red-800 hover:text-red-600 text-lg font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Form */}
        <TaskForm onSubmit={handleCreateTask} isLoading={isSubmitting} />

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="glass-card inline-flex items-center px-8 py-6 text-lg font-medium text-gray-800 glow">
              <svg className="inline w-6 h-6 mr-4 text-blue-600 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              Loading your tasks...
            </div>
          </div>
        )}

        {/* Task List */}
        {!isLoading && (
          <TaskList
            tasks={tasks}
            onCompleteTask={handleCompleteTask}
            isLoading={false}
          />
        )}
      </div>
    </div>
  );
};

export default App;
