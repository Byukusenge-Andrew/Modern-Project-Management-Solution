import React from 'react';
import { Users, UserPlus } from 'lucide-react';

export default function Team() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Team</h1>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <UserPlus className="h-5 w-5 mr-2" />
          Add Member
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
          <p className="text-gray-500">No team members added yet</p>
        </div>
      </div>
    </div>
  );
}