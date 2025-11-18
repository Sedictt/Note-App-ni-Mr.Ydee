import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';
import { ClipboardListIcon, PlusIcon } from './Icons';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  selectedTasks: Set<string>;
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  onAddNew: () => void;
  isBulkEditMode: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
  selectedTasks,
  onToggleSelection,
  onSelectAll,
  onAddNew,
  isBulkEditMode,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white rounded-xl shadow-md border-2 border-dashed border-gray-300">
        <ClipboardListIcon className="mx-auto h-16 w-16 text-orange-300" />
        <h3 className="mt-4 text-xl font-semibold text-gray-900">Your Task List is Empty</h3>
        <p className="mt-2 text-sm text-gray-500">Let's get organized. Add a task to get started!</p>
        <button
            onClick={onAddNew}
            className="mt-6 flex items-center mx-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
            <PlusIcon />
            <span className="ml-2">Add Your First Task</span>
        </button>
      </div>
    );
  }

  const allVisibleSelected = tasks.length > 0 && tasks.every(task => selectedTasks.has(task.id));
  const someVisibleSelected = tasks.some(task => selectedTasks.has(task.id)) && !allVisibleSelected;


  return (
    <div className="space-y-4">
      {isBulkEditMode && (
        <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            checked={allVisibleSelected}
            ref={input => {
              if (input) input.indeterminate = someVisibleSelected;
            }}
            onChange={onSelectAll}
            aria-label="Select all visible tasks"
          />
          <label className="ml-3 text-sm font-medium text-gray-700">
            {allVisibleSelected ? 'Deselect All' : 'Select All'}
          </label>
        </div>
      )}
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          isSelected={selectedTasks.has(task.id)}
          onToggleSelection={onToggleSelection}
          isBulkEditMode={isBulkEditMode}
        />
      ))}
    </div>
  );
};

export default TaskList;