import { create } from 'zustand';
import { generateId } from '../utils/id';

interface TimeEntry {
  id: string;
  projectId: string;
  userId: string;
  description: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  createdAt: string;
}

interface TimeTrackingState {
  entries: TimeEntry[];
  activeEntry: TimeEntry | null;
  currentEntry?: TimeEntry | null;
  getEntriesByUser: (userId: string) => TimeEntry[];
  totalHours: number;
  loading: boolean;
  fetchTimeStats: () => Promise<void>;
  startTracking: (projectId: string, description?: string, userId?: string) => Promise<void>;
  stopTracking: () => Promise<void>;
}

interface FetchTimeStats {
  (): Promise<void>;
}

interface StartTracking {
  (projectId: string, description?: string): Promise<void>;
}

interface StopTracking {
  (): Promise<void>;
}

interface AddEntry {
  (entryData: Partial<TimeEntry>): void;
}

interface DeleteEntry {
  (entryId: string): void;
}

interface GetEntriesByProject {
  (projectId: string): TimeEntry[];
}

interface GetEntriesByUser {
  (userId: string): TimeEntry[];
}

export const useTimeTrackingStore = create<TimeTrackingState>((set, get) => ({
  entries: [],
  activeEntry: null,
  totalHours: 0,
  loading: false,
  fetchTimeStats: (async () => {
    try {
      set({ loading: true });
      const response = await fetch('/api/entries');
      const data = await response.json();
      set({ entries: data, totalHours: data.reduce((total: number, entry: TimeEntry) => total + entry.duration, 0) });
    } catch (error) {
      console.error('Error fetching time entries:', error);
    } finally {
      set({ loading: false });
    }
  }) as FetchTimeStats,
  startTracking: (async (projectId : string, description :string,userId:string) => {
    const newEntry: TimeEntry = {
      id: generateId(),
      projectId,
      userId: userId || '',
      description: description || '',
      startTime: new Date().toISOString(),
      duration: 0,
      createdAt: new Date().toISOString(),
    };
    set({ activeEntry: newEntry });
  }) as StartTracking,
  stopTracking: (async () => {
    const { activeEntry, entries } = get();
    if (activeEntry) {
      const endTime = new Date().toISOString();
      const duration = Math.round(
        (new Date(endTime).getTime() - new Date(activeEntry.startTime).getTime()) / 60000
      );
      const completedEntry: TimeEntry = {
        ...activeEntry,
        endTime,
        duration,
      };
      set({
        entries: [...entries, completedEntry],
        activeEntry: null,
      });
    }
  }) as StopTracking,
  addEntry: ((entryData) => {
    const newEntry: TimeEntry = {
      id: generateId(),
      projectId: '',
      userId: '',
      description: '',
      startTime: new Date().toISOString(),
      duration: 0,
      createdAt: new Date().toISOString(),
      ...entryData,
    };
    set((state) => ({ entries: [...state.entries, newEntry] }));
  }) as AddEntry,
  deleteEntry: ((entryId) =>
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== entryId),
    }))) as DeleteEntry,
  getEntriesByProject: ((projectId) =>
    get().entries.filter((e) => e.projectId === projectId)) as GetEntriesByProject,
  getEntriesByUser: ((userId) =>
    get().entries.filter((e) => e.userId === userId)) as GetEntriesByUser,

}))


; 