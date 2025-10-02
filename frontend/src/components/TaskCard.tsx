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
    <div className="task-card">
      <div className="flex justify-between items-start">
        <div className="flex-1 mr-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {task.title}
          </h3>
          
          {task.description && (
            <p className="text-gray-600 mb-3 leading-relaxed">
              {task.description}
            </p>
          )}
          
          <p className="text-sm text-gray-500">
            Created: {formatDate(task.createdAt)}
          </p>
        </div>
        
        <div className="flex-shrink-0">
          <button
            onClick={handleComplete}
            disabled={isLoading}
            className={`btn-secondary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={`Mark "${task.title}" as completed`}
          >
            {isLoading ? 'Completing...' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
