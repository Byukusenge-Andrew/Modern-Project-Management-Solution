import  { useState } from 'react';
import { Users, MessageCircle } from 'lucide-react';
import { useTeamStore } from '../store/teamStore';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import ChatPanel from '../components/ChatPanel';

export default function TeamMembers() {
  const [showChat, setShowChat] = useState(false);
  const { currentTeam } = useTeamStore();
  const { user } = useAuthStore();
  const { rooms, createRoom } = useChatStore();

  const handleStartChat = () => {
    if (currentTeam && user) {
      let room = rooms.find((r) => r.teamId === currentTeam.id);
      if (!room) {
        const memberIds = currentTeam.members.map(member => member.id);
        room = createRoom(currentTeam.id, `${currentTeam.name} Chat`, memberIds);
      }
      setShowChat(true);
    }
  };

  const teamMembers = [
    { id: 1, name: 'John Doe', role: 'Project Manager', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', role: 'Developer', email: 'jane@example.com' },
    // Add more team members as needed
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleStartChat}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Team Chat
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Team Member
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4 p-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>

      {showChat && currentTeam && (
        <div className="fixed bottom-6 right-6">
          <ChatPanel
            roomId={rooms.find((r) => r.teamId === currentTeam.id)?.id || ''}
            onClose={() => setShowChat(false)}
          />
        </div>
      )}
    </div>
  );
}
