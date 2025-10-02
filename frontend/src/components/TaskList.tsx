import React from 'react';
import { Task } from '../types/task.types';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onCompleteTask: (taskId: number) => Promise<void>;
  isLoading: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onCompleteTask, isLoading }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-500">
          Get started by creating your first task above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Tasks ({tasks.length}/5)
        </h2>
        <div className="text-sm text-gray-500">
          Showing the 5 most recent incomplete tasks
        </div>
      </div>
      
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={onCompleteTask}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default TaskList;
