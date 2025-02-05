import { create } from 'zustand';
import { Team, User } from '../types';
import { generateId } from '../utils/id';

interface TeamState {
  teams: Team[];
  teamMembers: User[];
  loading: boolean;
  fetchTeams: () => Promise<void>;
  fetchTeamMembers: () => Promise<void>;
  createTeam: (name: string, description: string, isPublic: boolean) => Team;
  joinTeam: (verificationCode: string, userId: string) => boolean;
  leaveTeam: (teamId: string, userId: string) => void;
  setCurrentTeam: (team: Team | null) => void;
  currentTeam: Team | null;
}

export const useTeamStore = create<TeamState>((set, get) => ({
  teams: [],
  teamMembers: [],
  loading: false,
  fetchTeams: async () => {
    // Implementation
  },
  fetchTeamMembers: async () => {
    // Implementation
  },
  currentTeam: null,
  createTeam: (name, description, isPublic) => {
    const newTeam: Team = {
      id: generateId(),
      name,
      description,
      verificationCode: Math.random().toString(36).substring(7).toUpperCase(),
      members: [],
      projects: [],
      isPublic,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ teams: [...state.teams, newTeam] }));
    return newTeam;
  },
  joinTeam: (verificationCode, userId) => {
    let success = false;
    set((state) => {
      const team = state.teams.find((t) => t.verificationCode === verificationCode);
      if (team && !team.members.includes(userId)) {
        team.members.push(userId);
        success = true;
        return { teams: state.teams.map((t) => (t.id === team.id ? team : t)) };
      }
      return state;
    });
    return success;
  },
  leaveTeam: (teamId, userId) => {
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId
          ? { ...team, members: team.members.filter((id) => id !== userId) }
          : team
      ),
    }));
  },
  setCurrentTeam: (team) => set({ currentTeam: team }),
}));