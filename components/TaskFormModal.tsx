
import React, { useState } from 'react';
import { Task, Priority, Category } from '../types';
import { XIcon } from './Icons';

interface TaskFormModalProps {
  onClose: () => void;
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  taskToEdit: Task | null;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ onClose, onAddTask, onUpdateTask, taskToEdit }) => {
  const [task, setTask] = useState<Omit<Task, 'id' | 'isCompleted' | 'dateAdded'>>({
    name: taskToEdit?.name || '',
    subject: taskToEdit?.subject || '',
    deadline: taskToEdit?.deadline ? taskToEdit.deadline.slice(0, 16) : '',
    notes: taskToEdit?.notes || '',
    priority: taskToEdit?.priority || Priority.Medium,
    category: taskToEdit?.category || Category.Homework,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskToEdit) {
      onUpdateTask({ ...task, id: taskToEdit.id, isCompleted: taskToEdit.isCompleted, dateAdded: taskToEdit.dateAdded });
    } else {
      onAddTask({ ...task, id: Date.now().toString(), isCompleted: false, dateAdded: new Date().toISOString() });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{taskToEdit ? 'Edit Task' : 'Add New Task'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XIcon />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Task Name</label>
              <input type="text" name="name" id="name" value={task.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject / Course</label>
              <input type="text" name="subject" id="subject" value={task.subject} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
              <input type="datetime-local" name="deadline" id="deadline" value={task.deadline} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                <select name="priority" id="priority" value={task.priority} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                  {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select name="category" id="category" value={task.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
              <textarea name="notes" id="notes" value={task.notes} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">{taskToEdit ? 'Save Changes' : 'Add Task'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskFormModal;
