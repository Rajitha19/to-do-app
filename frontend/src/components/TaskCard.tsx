import React from 'react';
import { Task } from '../types/task.types';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: number) => Promise<void>;
  isLoading: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, isLoading }) => {
  const handleComplete = async () => {
    try {
      await onComplete(task.id);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="task-card group">
      <div className="flex justify-between items-start">
        <div className="flex-1 mr-6">
          <div className="flex items-start mb-3">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2 mr-3 group-hover:animate-pulse"></div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors duration-300">
              {task.title}
            </h3>
          </div>

          {task.description && (
            <div className="ml-5 mb-4">
              <p className="text-gray-600 leading-relaxed text-base">
                {task.description}
              </p>
            </div>
          )}

          <div className="ml-5 flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Created {formatDate(task.createdAt)}</span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <button
            onClick={handleComplete}
            disabled={isLoading}
            className={`btn-secondary group-hover:glow-green ${
              isLoading ? 'opacity-50 cursor-not-allowed transform-none' : ''
            }`}
            aria-label={`Mark "${task.title}" as completed`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Completing...
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Complete
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
