import React from 'react';
import { useProjectStore } from '../store/projectStore';
import { Task } from '../types';

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-50' },
  { id: 'review', title: 'Review', color: 'bg-yellow-50' },
  { id: 'done', title: 'Done', color: 'bg-green-50' },
] as const;

interface KanbanBoardProps {
  projectId: string;
}

export default function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { projects, updateTaskStatus } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  const getTasksByStatus = (status: Task['status']) => {
    return project?.tasks.filter((task) => task.status === status) || [];
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId && project) {
      updateTaskStatus(project.id, taskId, status);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {COLUMNS.map((column) => (
        <div
          key={column.id}
          className={`${column.color} p-4 rounded-lg`}
          onDrop={(e) => handleDrop(e, column.id)}
          onDragOver={handleDragOver}
        >
          <h3 className="font-medium text-gray-900 mb-4">{column.title}</h3>
          <div className="space-y-3">
            {getTasksByStatus(column.id).map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                className="bg-white p-3 rounded shadow-sm border border-gray-200 cursor-move"
              >
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                {task.assigneeId && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {task.assigneeId}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}