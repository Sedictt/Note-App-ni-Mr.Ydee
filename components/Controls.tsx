import React from 'react';
import { FilterType, SortType } from '../types';

interface ControlsProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  sortBy: SortType;
  setSortBy: (sortBy: SortType) => void;
}

const Controls: React.FC<ControlsProps> = ({ filter, setFilter, sortBy, setSortBy }) => {
  const filterOptions: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'today', label: "Today" },
    { value: 'week', label: 'This Week' },
    { value: 'completed', label: 'Completed' },
  ];

  const sortOptions: { value: SortType; label: string }[] = [
    { value: 'deadline', label: 'Deadline' },
    { value: 'priority', label: 'Priority' },
    { value: 'subject', label: 'Subject' },
    { value: 'dateAdded', label: 'Date Added' },
  ];

  const baseButtonClass = "px-3 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
  const activeFilterClass = "bg-indigo-600 text-white shadow-md";
  const inactiveFilterClass = "bg-white text-gray-600 hover:bg-gray-100";

  return (
    <div className="bg-white/70 backdrop-blur-sm p-3 rounded-xl shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
      <div className="flex flex-wrap justify-center gap-2" role="group">
        {filterOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`${baseButtonClass} ${filter === option.value ? activeFilterClass : inactiveFilterClass}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="flex items-center">
        <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">Sort by:</label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortType)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Controls;