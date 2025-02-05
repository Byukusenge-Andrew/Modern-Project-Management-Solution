import React, { useState } from 'react';
import { CalendarIcon, Plus } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { formatDate } from '../utils/date';
import { Task } from '../types';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'task' | 'project';
  status?: Task['status'];
  projectName?: string;
}

export default function Calendar() {
  const { projects } = useProjectStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get all tasks with due dates from all projects
  const events: CalendarEvent[] = projects.flatMap((project) =>
    project.tasks
      .filter((task) => task.dueDate)
      .map((task) => ({
        id: task.id,
        title: task.title,
        date: task.dueDate!,
        type: 'task',
        status: task.status,
        projectName: project.name,
      }))
  );

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.date.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add empty days for padding
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" />
          Add Event
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{monthName}</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium">
                {day}
              </div>
            ))}
            {days.map((day, index) => (
              <div
                key={index}
                className={`bg-white p-2 min-h-[100px] ${
                  day ? 'border border-gray-100' : ''
                }`}
              >
                {day && (
                  <>
                    <div className="text-sm text-gray-500">{day.getDate()}</div>
                    <div className="space-y-1 mt-1">
                      {eventsByDate[formatDate(day)]?.map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded ${
                            getStatusColor(event.status || 'todo')
                          }`}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="text-xs opacity-75">{event.projectName}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}