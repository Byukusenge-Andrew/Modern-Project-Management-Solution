import  { useState } from 'react';
import { Clock, PlayCircle, StopCircle } from 'lucide-react';
import { useTimeTrackingStore } from '../store/timeTrackingStore';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import { formatDate, formatRelativeTime } from '../utils/date';

export default function TimeLog() {
  const { user } = useAuthStore();
  const { projects } = useProjectStore();
  const {
    currentEntry,
    startTracking,
    getEntriesByUser,
    stopTracking,
  } = useTimeTrackingStore();
  const [selectedProject, setSelectedProject] = useState('');
  const [description, setDescription] = useState('');
  
  const userEntries = user ? getEntriesByUser(user.id) : [];

  const handleStartTracking = () => {
    if (user && selectedProject && description) {
      startTracking(selectedProject, user.id, description);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Time Log</h1>
        {!currentEntry ? (
          <button
            onClick={handleStartTracking}
            disabled={!selectedProject || !description}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <PlayCircle className="h-5 w-5 mr-2" />
            Start Timer
          </button>
        ) : (
          <button
            onClick={stopTracking}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <StopCircle className="h-5 w-5 mr-2" />
            Stop Timer
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <select
              title="Select a project"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                disabled={!!currentEntry}
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                disabled={!!currentEntry}
                placeholder="What are you working on?"
              />
            </div>
          </div>

          {currentEntry && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900">Currently Tracking</h3>
              <p className="text-blue-800 mt-1">{currentEntry.description}</p>
              <p className="text-sm text-blue-700 mt-1">
                Started {formatRelativeTime(currentEntry.startTime)}
              </p>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Entries</h3>
            <div className="space-y-4">
              {userEntries.map((entry) => {
                const project = projects.find((p) => p.id === entry.projectId);
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-purple-100">
                        <Clock className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-900">
                          {project?.name || 'Unknown Project'}
                        </h4>
                        <p className="text-sm text-gray-500">{entry.description}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(entry.startTime)}
                        </p>
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {entry.duration}m
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 