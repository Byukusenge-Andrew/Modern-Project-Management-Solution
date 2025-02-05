import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { Message, ChatRoom } from '../types';
import { generateId } from '../utils/id';

interface ChatState {
  rooms: ChatRoom[];
  currentRoom: ChatRoom | null;
  createRoom: (teamId: string, name: string, members: string[]) => ChatRoom;
  sendMessage: (teamId: string, content: string) => void;
  markAsRead: (roomId: string, userId: string) => void;
  setCurrentRoom: (room: ChatRoom | null) => void;
  getRoomMessages: (roomId: string) => Message[];
  getUnreadCount: (userId: string) => number;
  messages: Record<string, Message[]>;
  socket: Socket | null;
  isConnected: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  rooms: [],
  currentRoom: null,
  createRoom: (teamId, name, members) => {
    const newRoom: ChatRoom = {
      id: generateId(),
      teamId,
      name,
      members,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ rooms: [...state.rooms, newRoom] }));
    return newRoom;
  },
  sendMessage: async (teamId, content) => {
    const { socket } = get();
    if (!socket) return;

    try {
      const response = await axios.post(`/api/chat/teams/${teamId}/messages`, {
        content,
      });

      set((state) => ({
        rooms: state.rooms.map((room) =>
          room.teamId === teamId
            ? {
                ...room,
                messages: [...room.messages, response.data],
                updatedAt: new Date().toISOString(),
              }
            : room
        ),
      }));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  },
  markAsRead: async (roomId, userId) => {
    try {
      await axios.post(`/api/chat/teams/${roomId}/messages/read`);
      set((state) => ({
        rooms: state.rooms.map((room) =>
          room.id === roomId
            ? {
                ...room,
                messages: room.messages.map((msg) => ({
                  ...msg,
                  readBy: [...new Set([...msg.readBy, userId])],
                })),
              }
            : room
        ),
      }));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  },
  setCurrentRoom: (room) => set({ currentRoom: room }),
  getRoomMessages: (roomId) => {
    return get().rooms.find((r) => r.id === roomId)?.messages || [];
  },
  getUnreadCount: (userId) =>
    get().rooms.reduce(
      (acc, room) =>
        acc +
        room.messages.filter((msg) => !msg.readBy.includes(userId)).length,
      0
    ),
  messages: {},
  socket: null,
  isConnected: false,
  connect: (token: string) => {
    const socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
    });

    socket.on('connect', () => {
      set({ isConnected: true });
    });

    socket.on('newMessage', (message: Message) => {
      set((state) => ({
        messages: {
          ...state.messages,
          [message.teamId]: [...(state.messages[message.teamId] || []), message],
        },
      }));
    });

    set({ socket });
  },
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
})); 