import React, { useMemo } from 'react';
import { BarChart2, Download, PieChart, Clock } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { useTimeTrackingStore } from '../store/timeTrackingStore';

export default function Reports() {
  const { projects } = useProjectStore();
  const { entries } = useTimeTrackingStore();

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalTasks = projects.reduce((acc, project) => acc + project.tasks.length, 0);
    const completedTasks = projects.reduce(
      (acc, project) =>
        acc + project.tasks.filter((task) => task.status === 'done').length,
      0
    );
    const totalTimeLogged = entries.reduce((acc, entry) => acc + entry.duration, 0);

    const tasksByStatus = projects.reduce((acc, project) => {
      project.tasks.forEach((task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const tasksByPriority = projects.reduce((acc, project) => {
      project.tasks.forEach((task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      completionRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
      totalTimeLogged,
      tasksByStatus,
      tasksByPriority,
    };
  }, [projects, entries]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Download className="h-5 w-5 mr-2" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <BarChart2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Projects</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalProjects}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <PieChart className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Task Completion</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.completionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Time Logged</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(stats.totalTimeLogged / 60)}h
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Status</h2>
          <div className="space-y-4">
            {Object.entries(stats.tasksByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {status}
                    </span>
                    <span className="text-sm text-gray-500">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(count / stats.totalTasks) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Priority</h2>
          <div className="space-y-4">
            {Object.entries(stats.tasksByPriority).map(([priority, count]) => (
              <div key={priority} className="flex items-center">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {priority}
                    </span>
                    <span className="text-sm text-gray-500">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        priority === 'high'
                          ? 'bg-red-600'
                          : priority === 'medium'
                          ? 'bg-yellow-600'
                          : 'bg-green-600'
                      }`}
                      style={{
                        width: `${(count / stats.totalTasks) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}