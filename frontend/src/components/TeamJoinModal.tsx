import React, { useState } from 'react';
import { useTeamStore } from '../store/teamStore';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { X } from 'lucide-react';

interface TeamJoinModalProps {
  onClose: () => void;
}

export default function TeamJoinModal({ onClose }: TeamJoinModalProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const { joinTeam } = useTeamStore();
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && verificationCode) {
      const success = joinTeam(verificationCode, user.id);
      if (success) {
        addNotification(
          user.id,
          'Team Joined',
          'You have successfully joined the team!',
          'success'
        );
        onClose();
      } else {
        addNotification(
          user.id,
          'Error',
          'Invalid verification code or you are already a member',
          'error'
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Join Team</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter team code"
              maxLength={6}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Join Team
          </button>
        </form>
      </div>
    </div>
  );
}