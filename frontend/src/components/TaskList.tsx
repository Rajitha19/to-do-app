import React from 'react';
import { Task } from '../types/task.types';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onCompleteTask: (taskId: number) => Promise<void>;
  isLoading: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onCompleteTask,
  isLoading,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="glass-card text-center py-16">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-2xl"></div>
          </div>
          <div className="relative text-gray-400 mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-lg mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-600 mb-3">No tasks yet</h3>
          <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
            Your productivity journey starts here! Create your first task above and watch your progress unfold.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-3 animate-pulse"></div>
            <h2 className="text-2xl font-bold gradient-text">
              Your Active Tasks
            </h2>
          </div>
          <div className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-xl">
            <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm font-semibold text-blue-700">
              {tasks.length} of 5 tasks
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6 text-center">
          Complete tasks to make room for new ones • Stay focused and productive
        </p>
      </div>

      <div className="grid gap-4">
        {tasks.map((task, index) => (
          <div 
            key={task.id} 
            className="transform transition-all duration-300"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'slideInUp 0.6s ease-out forwards'
            }}
          >
            <TaskCard
              task={task}
              onComplete={onCompleteTask}
              isLoading={isLoading}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
