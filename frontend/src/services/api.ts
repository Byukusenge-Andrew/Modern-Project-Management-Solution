import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) => 
    api.post('/auth/register', { name, email, password }),
};

// Projects API
export const projectAPI = {
  getProjects: () => api.get('/projects'),
  createProject: (data: any) => api.post('/projects', data),
  updateProject: (id: string, data: any) => api.patch(`/projects/${id}`, data),
  deleteProject: (id: string) => api.delete(`/projects/${id}`),
};

// Tasks API
export const taskAPI = {
  getProjectTasks: (projectId: string) => 
    api.get(`/tasks/projects/${projectId}/tasks`),
  createTask: (projectId: string, data: any) => 
    api.post(`/tasks/projects/${projectId}/tasks`, data),
  updateTaskStatus: (taskId: string, status: string) => 
    api.patch(`/tasks/tasks/${taskId}/status`, { status }),
  assignTask: (taskId: string, assigneeId: string) => 
    api.post(`/tasks/tasks/${taskId}/assign`, { assigneeId }),
  deleteTask: (taskId: string) => 
    api.delete(`/tasks/tasks/${taskId}`),
};

// Teams API
export const teamAPI = {
  getMyTeams: () => api.get('/teams/my-teams'),
  createTeam: (data: any) => api.post('/teams', data),
  joinTeam: (verificationCode: string) => 
    api.post('/teams/join', { verificationCode }),
  leaveTeam: (teamId: string) => api.post(`/teams/${teamId}/leave`),
  getTeamMembers: (teamId: string) => api.get(`/teams/${teamId}/members`),
  updateTeam: (teamId: string, data: any) => 
    api.patch(`/teams/${teamId}`, data),
};

// Time Tracking API
export const timeTrackingAPI = {
  startTracking: (data: any) => api.post('/time-tracking/start', data),
  stopTracking: () => api.post('/time-tracking/stop'),
  getEntries: (params?: any) => api.get('/time-tracking/entries', { params }),
  deleteEntry: (entryId: string) => 
    api.delete(`/time-tracking/entries/${entryId}`),
  getProjectStats: (projectId: string, params?: any) => 
    api.get(`/time-tracking/projects/${projectId}/stats`, { params }),
};

// Chat API
export const chatAPI = {
  getTeamMessages: (teamId: string, params?: any) => 
    api.get(`/chat/teams/${teamId}/messages`, { params }),
  sendMessage: (teamId: string, content: string) => 
    api.post(`/chat/teams/${teamId}/messages`, { content }),
  markAsRead: (teamId: string) => 
    api.post(`/chat/teams/${teamId}/messages/read`),
  getUnreadCount: (teamId: string) => 
    api.get(`/chat/teams/${teamId}/messages/unread`),
};

export default api; 