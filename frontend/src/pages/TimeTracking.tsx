import { Clock } from 'lucide-react';

export default function TimeTracking() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Time Tracking</h1>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Clock className="h-5 w-5 mr-2" />
          Start Timer
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Time Entries</h2>
          <p className="text-gray-500">No recent time entries</p>
        </div>
      </div>
    </div>
  );
}