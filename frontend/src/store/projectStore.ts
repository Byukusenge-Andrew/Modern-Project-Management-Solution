import { create } from 'zustand';
import axios from 'axios';
import { Project, Task } from '../types';
import { projectAPI, taskAPI } from '../services/api';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  addProject: (project: Partial<Project>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  addTask: (projectId: string, task: Partial<Task>) => Promise<void>;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (projectId: string, taskId: string) => Promise<void>;
  updateTaskStatus: (projectId: string, taskId: string, status: Task['status']) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get('/api/projects');
      set({ projects: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch projects', isLoading: false });
    }
  },

  addProject: async (project) => {
    try {
      const response = await axios.post('/api/projects', project);
      set((state) => ({
        projects: [...state.projects, response.data],
      }));
    } catch (error) {
      set({ error: 'Failed to create project' });
    }
  },

  updateProject: async (id, updates) => {
    try {
      const response = await axios.put(`/api/projects/${id}`, updates);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? response.data : p
        ),
      }));
    } catch (error) {
      set({ error: 'Failed to update project' });
    }
  },

  deleteProject: async (id) => {
    try {
      await axios.delete(`/api/projects/${id}`);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      }));
    } catch (error) {
      set({ error: 'Failed to delete project' });
    }
  },

  setCurrentProject: (project) => set({ currentProject: project }),

  addTask: async (projectId, taskData) => {
    try {
      const response = await taskAPI.createTask(projectId, taskData);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? { ...p, tasks: [...p.tasks, response.data] }
            : p
        ),
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create task' });
      throw error;
    }
  },

  updateTask: async (projectId, taskId, updates) => {
    try {
      const response = await taskAPI.updateTaskStatus(taskId, updates.status!);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                tasks: p.tasks.map((t) =>
                  t.id === taskId ? response.data : t
                ),
              }
            : p
        ),
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update task' });
      throw error;
    }
  },

  deleteTask: async (projectId, taskId) => {
    try {
      await taskAPI.deleteTask(taskId);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                tasks: p.tasks.filter((t) => t.id !== taskId),
              }
            : p
        ),
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete task' });
      throw error;
    }
  },

  updateTaskStatus: async (projectId, taskId, status) => {
    try {
      await axios.patch(`/api/tasks/${taskId}/status`, { status });
      set((state) => ({
        projects: state.projects.map((p) => {
          if (p.id === projectId) {
            return {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === taskId ? { ...t, status } : t
              ),
            };
          }
          return p;
        }),
      }));
    } catch (error) {
      set({ error: 'Failed to update task status' });
    }
  },
}));