import React from 'react';
import { Task } from '../types';
import { PencilIcon, TrashIcon, CalendarIcon, CheckCircleIcon, ArrowUturnLeftIcon } from './Icons';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
}

const getDeadlineColor = (deadline: string, isCompleted: boolean) => {
  if (isCompleted) return 'border-gray-300';
  const hoursLeft = (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60);
  if (hoursLeft < 0) return 'border-gray-500'; // Overdue
  if (hoursLeft <= 24) return 'border-red-500'; // Urgent
  if (hoursLeft <= 72) return 'border-yellow-500'; // Soon
  return 'border-blue-500'; // On track
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onToggleComplete, isSelected, onToggleSelection }) => {
  const deadlineColor = getDeadlineColor(task.deadline, task.isCompleted);
  
  return (
    <div className={`
      bg-white rounded-xl shadow-md transition-all duration-300 overflow-hidden
      border-l-8 ${deadlineColor}
      ${task.isCompleted ? 'opacity-70 bg-gray-50' : ''}
      ${isSelected ? 'ring-2 ring-orange-500 ring-offset-2' : ''}
      hover:shadow-lg hover:scale-[1.02]
    `}>
      <div className="p-5 flex items-start gap-4">
        {/* Checkbox for selection */}
        <input
          type="checkbox"
          className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer flex-shrink-0 mt-1"
          checked={isSelected}
          onChange={() => onToggleSelection(task.id)}
          aria-label={`Select task ${task.name}`}
        />

        {/* All other content */}
        <div className="flex-grow flex flex-col min-w-0">
          {/* Top Part: Title, Subject, and Deadline */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            {/* Left Part: Title and Subject */}
            <div className="min-w-0 mr-4">
              <p className={`font-bold text-lg text-gray-800 break-words ${task.isCompleted ? 'line-through' : ''}`}>{task.name}</p>
              <p className="text-sm text-gray-600">{task.subject}</p>
            </div>
            {/* Right Part: Deadline */}
            <div className="flex items-center text-sm text-gray-700 whitespace-nowrap flex-shrink-0">
              <CalendarIcon className="w-4 h-4 mr-1.5 text-gray-500 flex-shrink-0" />
              <span>{new Date(task.deadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </div>
          </div>

          {/* Bottom Part: Action Buttons */}
          <div className="flex items-center space-x-1 self-end mt-4">
            <button
              onClick={() => onToggleComplete(task.id)}
              className={`p-2 rounded-full transition-colors ${
                task.isCompleted
                  ? 'hover:bg-yellow-100 text-yellow-500 hover:text-yellow-700'
                  : 'hover:bg-green-100 text-green-500 hover:text-green-700'
              }`}
              title={task.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
            >
              {task.isCompleted ? <ArrowUturnLeftIcon /> : <CheckCircleIcon className="w-5 h-5" />}
            </button>
            <button onClick={() => onEdit(task)} className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-800" title="Edit Task"><PencilIcon /></button>
            <button onClick={() => onDelete(task.id)} className="p-2 rounded-full hover:bg-red-100 transition-colors text-red-500 hover:text-red-700" title="Delete Task"><TrashIcon /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;