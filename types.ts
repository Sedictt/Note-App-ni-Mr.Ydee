
export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum Category {
  Quiz = 'Quiz',
  Project = 'Project',
  Exam = 'Exam',
  Requirement = 'Requirement',
  Homework = 'Homework',
  Reading = 'Reading',
}

export interface Task {
  id: string;
  name: string;
  subject: string;
  deadline: string;
  notes: string;
  priority: Priority;
  category: Category;
  isCompleted: boolean;
  dateAdded: string;
}

export type FilterType = 'all' | 'today' | 'week' | 'completed';
export type SortType = 'deadline' | 'priority' | 'subject' | 'dateAdded';
export type ExportRatio = 'square' | 'portrait' | 'landscape';
