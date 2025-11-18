
import React, { useState, useRef } from 'react';
import { Task, ExportRatio, Category } from '../types';
import { XIcon, DownloadIcon, CheckCircleIcon } from './Icons';

// This is a browser global from the script in index.html
declare var htmlToImage: any;

interface ExportModalProps {
  onClose: () => void;
  tasks: Task[];
}

const categoryIcons: Record<Category, React.ReactNode> = {
  [Category.Quiz]: <span className="text-purple-500">❓</span>,
  [Category.Project]: <span className="text-blue-500">📁</span>,
  [Category.Exam]: <span className="text-red-500">🔥</span>,
  [Category.Requirement]: <span className="text-yellow-500">📋</span>,
  [Category.Homework]: <span className="text-green-500">📝</span>,
  [Category.Reading]: <span className="text-indigo-500">📖</span>,
};

const ExportModal: React.FC<ExportModalProps> = ({ onClose, tasks }) => {
  const [ratio, setRatio] = useState<ExportRatio>('square');
  const [fileType, setFileType] = useState<'png' | 'jpeg'>('png');
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const aspectRatios = {
    square: { class: 'aspect-square', w: 1080, h: 1080 },
    portrait: { class: 'aspect-[9/16]', w: 1080, h: 1920 },
    landscape: { class: 'aspect-video', w: 1280, h: 720 },
  };

  const handleExport = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    try {
      const { w, h } = aspectRatios[ratio];
      const dataUrl = fileType === 'png'
        ? await htmlToImage.toPng(exportRef.current, { width: w, height: h, quality: 1.0 })
        : await htmlToImage.toJpeg(exportRef.current, { width: w, height: h, quality: 0.95 });

      const link = document.createElement('a');
      link.download = `task-reminder.${fileType}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('oops, something went wrong!', error);
      alert('Could not export image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const uniqueSubjects = [...new Set(tasks.map(t => t.subject))];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-100 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Export Reminder</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><XIcon /></button>
        </div>
        <div className="flex-grow p-4 overflow-y-auto flex flex-col md:flex-row gap-4">
          <div className="md:w-1/3 space-y-4">
            <h3 className="font-semibold text-lg">Options</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Aspect Ratio</label>
              <select value={ratio} onChange={e => setRatio(e.target.value as ExportRatio)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                <option value="square">Square (1:1)</option>
                <option value="portrait">Portrait (9:16)</option>
                <option value="landscape">Landscape (16:9)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">File Type</label>
              <select value={fileType} onChange={e => setFileType(e.target.value as 'png' | 'jpeg')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
              </select>
            </div>
             <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 disabled:bg-gray-400"
            >
              {isExporting ? <CheckCircleIcon /> : <DownloadIcon />}
              <span className="ml-2">{isExporting ? 'Exporting...' : 'Download Image'}</span>
            </button>
          </div>
          <div className="md:w-2/3 flex-shrink-0 flex justify-center items-center bg-gray-300 p-2 rounded-lg">
            <div ref={exportRef} className={`${aspectRatios[ratio].class} w-full bg-slate-800 text-white p-6 md:p-8 lg:p-10 flex flex-col font-sans`}>
                <header className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-sky-300 tracking-tight">Upcoming Tasks</h1>
                        <p className="text-base lg:text-lg text-slate-300">{uniqueSubjects.join(', ')}</p>
                    </div>
                    <div className="text-right text-xs lg:text-sm text-slate-400">
                        <p>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                        <p>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                    </div>
                </header>
                <div className="flex-grow mt-6 space-y-3 lg:space-y-4 overflow-y-auto pr-2">
                    {tasks.map(task => (
                        <div key={task.id} className="bg-slate-700/50 rounded-lg p-3 lg:p-4 flex items-center gap-4">
                            <div className="text-xl lg:text-2xl">{categoryIcons[task.category]}</div>
                            <div className="flex-grow">
                                <p className="font-semibold text-base lg:text-lg text-slate-100">{task.name}</p>
                                <p className="text-sm lg:text-base text-slate-300">{new Date(task.deadline).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                            </div>
                            <div className={`text-xs font-bold px-2 py-1 rounded-full ${task.priority === 'High' ? 'bg-red-500/80' : task.priority === 'Medium' ? 'bg-yellow-500/80' : 'bg-green-500/80'}`}>
                                {task.priority}
                            </div>
                        </div>
                    ))}
                </div>
                <footer className="mt-auto pt-4 text-center text-xs text-slate-500">
                    Generated by Student Task Planner
                </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
