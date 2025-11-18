
import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';
import { ClipboardListIcon } from './Icons';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  selectedTasks: Set<string>;
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
  selectedTasks,
  onToggleSelection,
  onSelectAll
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
        <ClipboardListIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks found</h3>
        <p className="mt-1 text-sm text-gray-500">Add a new task to get started!</p>
      </div>
    );
  }

  const allVisibleSelected = tasks.length > 0 && selectedTasks.size === tasks.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
        <input
          type="checkbox"
          className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          checked={allVisibleSelected}
          onChange={onSelectAll}
          aria-label="Select all visible tasks"
        />
        <label className="ml-3 text-sm font-medium text-gray-700">
          {allVisibleSelected ? 'Deselect All' : 'Select All'}
        </label>
      </div>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          isSelected={selectedTasks.has(task.id)}
          onToggleSelection={onToggleSelection}
        />
      ))}
    </div>
  );
};

export default TaskList;
