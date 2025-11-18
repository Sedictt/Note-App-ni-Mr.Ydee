
import React from 'react';
import { Task, Priority, Category } from '../types';
import { PencilIcon, TrashIcon, CalendarIcon, TagIcon, FlagIcon, NotesIcon } from './Icons';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
}

const priorityConfig = {
  [Priority.High]: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' },
  [Priority.Medium]: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
  [Priority.Low]: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' },
};

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
      border-l-4 ${deadlineColor}
      ${task.isCompleted ? 'opacity-60' : ''}
      ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
    `}>
      <div className="p-5 flex flex-col md:flex-row items-start md:items-center">
        <div className="flex items-center flex-grow mb-4 md:mb-0">
          <input
            type="checkbox"
            className="h-6 w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            checked={isSelected}
            onChange={() => onToggleSelection(task.id)}
            aria-label={`Select task ${task.name}`}
          />
          <input
            type="checkbox"
            className="ml-4 h-6 w-6 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
            checked={task.isCompleted}
            onChange={(e) => {
              e.stopPropagation();
              onToggleComplete(task.id);
            }}
            aria-label={`Mark task ${task.name} as complete`}
          />
          <div className="ml-4 flex-grow">
            <p className={`font-bold text-lg text-gray-800 ${task.isCompleted ? 'line-through' : ''}`}>{task.name}</p>
            <p className="text-sm text-gray-600">{task.subject}</p>
          </div>
        </div>

        <div className="w-full md:w-auto grid grid-cols-2 sm:grid-cols-4 md:flex md:items-center gap-4 text-sm text-gray-700">
            <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${priorityConfig[task.priority].bg} ${priorityConfig[task.priority].text}`}>
              <FlagIcon className="w-4 h-4 mr-1" />
              {task.priority}
            </div>
            <div className="flex items-center">
              <TagIcon className="w-4 h-4 mr-1 text-gray-500" />
              {task.category}
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1 text-gray-500" />
              {new Date(task.deadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
        </div>

        <div className="flex items-center space-x-2 mt-4 md:mt-0 md:ml-6">
          <button onClick={() => onEdit(task)} className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-800"><PencilIcon /></button>
          <button onClick={() => onDelete(task.id)} className="p-2 rounded-full hover:bg-red-100 transition-colors text-red-500 hover:text-red-700"><TrashIcon /></button>
        </div>
      </div>
      {task.notes && (
          <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-600 flex items-start"><NotesIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"/> {task.notes}</p>
          </div>
        )}
    </div>
  );
};

export default TaskItem;
