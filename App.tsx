import React, { useState, useMemo, useEffect } from 'react';
import { Task, FilterType, SortType, ExportRatio } from './types';
import TaskList from './components/TaskList';
import TaskFormModal from './components/TaskFormModal';
import Controls from './components/Controls';
import ExportModal from './components/ExportModal';
import { PlusIcon, DownloadIcon } from './components/Icons';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('deadline');
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, isCompleted: !task.isCompleted } : task));
  };

  const openEditForm = (task: Task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };
  
  const openNewForm = () => {
    setTaskToEdit(null);
    setIsFormOpen(true);
  };

  const handleToggleSelection = (id: string) => {
    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (taskIds: string[]) => {
    if (selectedTasks.size === taskIds.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(taskIds));
    }
  };

  const filteredTasks = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

    let filtered = tasks;

    if (filter === 'completed') {
      filtered = tasks.filter(t => t.isCompleted);
    } else {
      filtered = tasks.filter(t => !t.isCompleted);
      if (filter === 'today') {
        filtered = filtered.filter(t => new Date(t.deadline).toDateString() === now.toDateString());
      } else if (filter === 'week') {
        filtered = filtered.filter(t => new Date(t.deadline) <= endOfWeek);
      }
    }
    return filtered;
  }, [tasks, filter]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'priority':
          const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'subject':
          return a.subject.localeCompare(b.subject);
        case 'dateAdded':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        default:
          return 0;
      }
    });
  }, [filteredTasks, sortBy]);

  const tasksToExport = useMemo(() => {
    if (selectedTasks.size === 0) return [];
    return tasks.filter(task => selectedTasks.has(task.id));
  }, [tasks, selectedTasks]);
  
  return (
    <div className="min-h-screen font-sans text-gray-800">
      <main className="max-w-4xl mx-auto p-3 sm:p-4 md:p-8">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 tracking-tight">Task Planner</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExportOpen(true)}
              disabled={selectedTasks.size === 0}
              className="flex items-center bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <DownloadIcon />
              <span className="ml-2 hidden sm:inline">Export</span>
            </button>
            <button
              onClick={openNewForm}
              className="flex items-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <PlusIcon />
              <span className="ml-2 hidden sm:inline">Add Task</span>
            </button>
          </div>
        </header>
        
        <Controls filter={filter} setFilter={setFilter} sortBy={sortBy} setSortBy={setSortBy} />

        <TaskList
          tasks={sortedTasks}
          onEdit={openEditForm}
          onDelete={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
          selectedTasks={selectedTasks}
          onToggleSelection={handleToggleSelection}
          onSelectAll={() => handleSelectAll(sortedTasks.map(t => t.id))}
          onAddNew={openNewForm}
        />

        {isFormOpen && (
          <TaskFormModal
            onClose={() => setIsFormOpen(false)}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            taskToEdit={taskToEdit}
          />
        )}
        
        {isExportOpen && (
          <ExportModal
            onClose={() => setIsExportOpen(false)}
            tasks={tasksToExport}
          />
        )}
      </main>
    </div>
  );
};

export default App;