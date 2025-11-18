import React from 'react';
import { Task, Priority } from '../types';
import { PencilIcon, TrashIcon, CalendarIcon, TagIcon, FlagIcon, NotesIcon, CheckCircleIcon, ArrowUturnLeftIcon } from './Icons';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
}

const priorityConfig = {
  [Priority.High]: { bg: 'bg-red-100', text: 'text-red-800' },
  [Priority.Medium]: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  [Priority.Low]: { bg: 'bg-green-100', text: 'text-green-800' },
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
      border-l-8 ${deadlineColor}
      ${task.isCompleted ? 'opacity-70 bg-gray-50' : ''}
      ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
      hover:shadow-lg hover:scale-[1.02]
    `}>
      <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Checkbox and Task Name */}
        <div className="flex items-center flex-grow w-full">
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer flex-shrink-0"
            checked={isSelected}
            onChange={() => onToggleSelection(task.id)}
            aria-label={`Select task ${task.name}`}
          />
          <div className="ml-4 flex-grow">
            <p className={`font-bold text-lg text-gray-800 ${task.isCompleted ? 'line-through' : ''}`}>{task.name}</p>
            <p className="text-sm text-gray-600">{task.subject}</p>
          </div>
        </div>

        {/* Details and Actions */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pl-1 sm:pl-0">
            {/* Details Section */}
            <div className="flex-grow grid grid-cols-2 sm:flex sm:items-center gap-x-4 gap-y-2 text-sm text-gray-700">
                <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${priorityConfig[task.priority].bg} ${priorityConfig[task.priority].text}`}>
                <FlagIcon className="w-4 h-4 mr-1.5" />
                {task.priority}
                </div>
                <div className="flex items-center">
                <TagIcon className="w-4 h-4 mr-1.5 text-gray-500" />
                {task.category}
                </div>
                <div className="flex items-center col-span-2">
                <CalendarIcon className="w-4 h-4 mr-1.5 text-gray-500" />
                {new Date(task.deadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 self-end sm:self-center sm:ml-4">
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
      {task.notes && (
          <div className="bg-gray-50/80 px-5 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-700 flex items-start"><NotesIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-500"/> {task.notes}</p>
          </div>
        )}
    </div>
  );
};

export default TaskItem;