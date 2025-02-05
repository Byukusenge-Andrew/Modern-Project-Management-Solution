import React, { useState } from 'react';
import { CheckCircle, Plus, AlertTriangle } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import { Task } from '../types';
import TaskModal from '../components/TaskModal';
import { formatDate } from '../utils/date';

export default function Tasks() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { projects, addTask, updateTask, deleteTask } = useProjectStore();
  const { user } = useAuthStore();

  // Get all tasks from all projects
  const allTasks = projects.flatMap((project) =>
    project.tasks.map((task) => ({
      ...task,
      projectName: project.name,
      projectId: project.id,
    }))
  );

  const handleCreateTask = (taskData: Partial<Task>) => {
    if (selectedTask && selectedTask.projectId) {
      updateTask(selectedTask.projectId, selectedTask.id, taskData);
    } else if (taskData.projectId) {
      addTask(taskData.projectId, taskData);
    }
    setShowModal(false);
    setSelectedTask(null);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return 'text-green-800 bg-green-100';
      case 'in-progress':
        return 'text-blue-800 bg-blue-100';
      case 'review':
        return 'text-yellow-800 bg-yellow-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <button
          onClick={() => {
            setSelectedTask(null);
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Task
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4 p-6">
          {allTasks.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-gray-500">No tasks found. Create your first task!</p>
            </div>
          ) : (
            allTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-yellow-100">
                    <CheckCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-500">{task.projectName}</p>
                    {task.dueDate && (
                      <p className="text-sm text-gray-500">
                        Due: {formatDate(task.dueDate)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <TaskModal
          onClose={() => {
            setShowModal(false);
            setSelectedTask(null);
          }}
          onSubmit={handleCreateTask}
          initialData={selectedTask || undefined}
          projectId={selectedTask?.projectId || projects[0]?.id}
        />
      )}
    </div>
  );
} 