import React, { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { Task, ExportRatio, Category } from '../types';
import { XIcon, DownloadIcon, CheckCircleIcon } from './Icons';

interface ExportModalProps {
  onClose: () => void;
  tasks: Task[];
}

const categoryIcons: Record<Category, React.ReactNode> = {
  [Category.Quiz]: <span className="text-xl lg:text-2xl">🧐</span>,
  [Category.Project]: <span className="text-xl lg:text-2xl">🚀</span>,
  [Category.Exam]: <span className="text-xl lg:text-2xl">✍️</span>,
  [Category.Requirement]: <span className="text-xl lg:text-2xl">📋</span>,
  [Category.Homework]: <span className="text-xl lg:text-2xl">📝</span>,
  [Category.Reading]: <span className="text-xl lg:text-2xl">📖</span>,
};

const themeConfig = {
  dark: {
    bg: 'bg-gradient-to-br from-slate-800 to-slate-900',
    text: 'text-white',
    headerText: 'text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-300',
    subHeaderText: 'text-slate-300',
    borderColor: 'border-slate-600',
    taskBg: 'bg-slate-700/60',
    taskText: 'text-slate-100',
    taskSubText: 'text-slate-300',
    watermark: 'text-slate-500/80',
    priority: {
        High: 'bg-red-500/80 text-white',
        Medium: 'bg-yellow-500/80 text-yellow-950',
        Low: 'bg-green-500/80 text-white',
    }
  },
  light: {
    bg: 'bg-gradient-to-br from-white to-gray-100',
    text: 'text-gray-800',
    headerText: 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500',
    subHeaderText: 'text-gray-600',
    borderColor: 'border-gray-200',
    taskBg: 'bg-white/80 border',
    taskText: 'text-gray-900',
    taskSubText: 'text-gray-600',
    watermark: 'text-gray-400',
    priority: {
        High: 'bg-red-100 text-red-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        Low: 'bg-green-100 text-green-800',
    }
  },
  mint: {
    bg: 'bg-gradient-to-br from-green-50 to-teal-100',
    text: 'text-teal-900',
    headerText: 'text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-500',
    subHeaderText: 'text-teal-700',
    borderColor: 'border-teal-200',
    taskBg: 'bg-white/70 border',
    taskText: 'text-teal-950',
    taskSubText: 'text-teal-800',
    watermark: 'text-teal-500',
    priority: {
        High: 'bg-red-200 text-red-900',
        Medium: 'bg-yellow-200 text-yellow-900',
        Low: 'bg-green-200 text-green-900',
    }
  },
};

const ExportModal: React.FC<ExportModalProps> = ({ onClose, tasks }) => {
  const [ratio, setRatio] = useState<ExportRatio>('square');
  const [fileType, setFileType] = useState<'png' | 'jpeg'>('png');
  const [options, setOptions] = useState({
    title: 'Upcoming Tasks',
    theme: 'dark',
    showSubject: true,
    showDeadline: true,
    showPriority: true,
    showCategoryIcon: true,
    showWatermark: true,
  });
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const aspectRatios = {
    square: { class: 'aspect-square', w: 1080, h: 1080 },
    portrait: { class: 'aspect-[9/16]', w: 1080, h: 1920 },
    landscape: { class: 'aspect-video', w: 1920, h: 1080 },
  };

  const handleExport = async () => {
    const element = exportRef.current;
    if (!element) {
        alert('Could not find the element to export.');
        return;
    }

    setIsExporting(true);
    try {
        const { w, h } = aspectRatios[ratio];

        // This is the correct scaling logic.
        // It calculates a scale factor based on the target width and the element's actual on-screen width.
        // This scale factor is then applied via a CSS transform during the image generation process.
        // 'transform-origin: top left' ensures the scaling originates from the corner, not the center.
        const scale = w / element.offsetWidth;

        const imageOptions = {
            width: w,
            height: h,
            // Setting pixelRatio to 2 renders at 2x resolution and scales down,
            // resulting in a much crisper, higher-quality final image.
            pixelRatio: 2,
            style: {
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
            },
        };

        const dataUrl = fileType === 'png'
            ? await htmlToImage.toPng(element, imageOptions)
            : await htmlToImage.toJpeg(element, { ...imageOptions, quality: 0.95 });

        const link = document.createElement('a');
        link.download = `task-list-${new Date().toISOString().split('T')[0]}.${fileType}`;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Oops, something went wrong!', error);
        alert('Could not export image. Please try again.');
    } finally {
        setIsExporting(false);
    }
  };


  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setOptions(prev => ({...prev, [name]: checked }));
  };

  const currentTheme = themeConfig[options.theme as keyof typeof themeConfig];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-100 rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">Export Task List</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><XIcon /></button>
        </div>
        <div className="flex-grow p-4 overflow-y-auto flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3 space-y-4 overflow-y-auto pr-2">
            <h3 className="font-semibold text-lg text-gray-800">Customization</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
                <select value={ratio} onChange={e => setRatio(e.target.value as ExportRatio)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="square">Square (1:1)</option>
                  <option value="portrait">Portrait (9:16)</option>
                  <option value="landscape">Landscape (16:9)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
                <select value={fileType} onChange={e => setFileType(e.target.value as 'png' | 'jpeg')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                </select>
              </div>
              <div>
                <label htmlFor="export-title" className="block text-sm font-medium text-gray-700 mb-1">Custom Title</label>
                <input type="text" id="export-title" value={options.title} onChange={e => setOptions(prev => ({ ...prev, title: e.target.value }))} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(themeConfig)).map(themeKey => (
                  <button key={themeKey} onClick={() => setOptions(prev => ({ ...prev, theme: themeKey }))} className={`capitalize text-sm font-semibold p-2 rounded-md transition-all ${options.theme === themeKey ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}`}>
                    <div className={`w-full h-8 rounded ${themeConfig[themeKey as keyof typeof themeConfig].bg} mb-1 border`}></div>
                    {themeKey}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Options</label>
                <div className="space-y-2 bg-white p-3 rounded-md border">
                    {/* Fix: Use 'as const' to give 'key' a specific literal union type, ensuring options[key] is a boolean. */}
                    {(['showSubject', 'showDeadline', 'showPriority', 'showCategoryIcon', 'showWatermark'] as const).map(key => (
                        <label key={key} className="flex items-center">
                            <input type="checkbox" name={key} checked={options[key]} onChange={handleOptionChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <span className="ml-2 text-sm text-gray-800">Show {key.replace('show', '').replace(/([A-Z])/g, ' $1').trim()}</span>
                        </label>
                    ))}
                </div>
            </div>

             <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-wait mt-2"
            >
              {isExporting ? <CheckCircleIcon className="w-5 h-5 animate-pulse" /> : <DownloadIcon />}
              <span className="ml-2">{isExporting ? 'Exporting...' : 'Download Image'}</span>
            </button>
          </div>
          <div className="lg:w-2/3 flex-shrink-0 flex justify-center items-center bg-gray-200 p-2 sm:p-4 rounded-lg">
            <div ref={exportRef} className={`${aspectRatios[ratio].class} w-full ${currentTheme.bg} ${currentTheme.text} p-6 md:p-8 lg:p-10 flex flex-col font-sans`}>
                <header className={`flex justify-between items-start border-b ${currentTheme.borderColor} pb-4`}>
                    <div>
                        <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight ${currentTheme.headerText}`}>{options.title}</h1>
                    </div>
                    <div className="text-right text-xs lg:text-sm text-slate-400 flex-shrink-0 ml-4">
                        <p>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                        <p>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                    </div>
                </header>
                <div className="flex-grow mt-6 space-y-3 lg:space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    {tasks.map(task => (
                        <div key={task.id} className={`${currentTheme.taskBg} rounded-lg p-3 lg:p-4 flex items-center gap-4 border ${currentTheme.borderColor}`}>
                            {options.showCategoryIcon && <div className="flex-shrink-0">{categoryIcons[task.category]}</div>}
                            <div className="flex-grow">
                                <p className={`font-semibold text-base lg:text-lg ${currentTheme.taskText}`}>{task.name}</p>
                                {options.showSubject && <p className={`text-sm ${currentTheme.taskSubText}`}>{task.subject}</p>}
                                {options.showDeadline && <p className={`text-sm lg:text-base ${currentTheme.taskSubText}`}>{new Date(task.deadline).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>}
                            </div>
                            {options.showPriority &&
                              <div className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${currentTheme.priority[task.priority]}`}>
                                {task.priority}
                              </div>
                            }
                        </div>
                    ))}
                     {tasks.length === 0 && <p className="text-slate-400 text-center py-8">No tasks selected to export.</p>}
                </div>
                {options.showWatermark && 
                    <footer className={`mt-auto pt-4 text-center text-xs ${currentTheme.watermark}`}>
                        Generated by Student Task Planner
                    </footer>
                }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;