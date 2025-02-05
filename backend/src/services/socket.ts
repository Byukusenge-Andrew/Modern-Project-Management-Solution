import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const setupWebSocket = (io: Server) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        next(new Error('Not authorized'));
        return;
      }

      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Not authorized'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.data.user.name);

    socket.on('joinTeam', (teamId: string) => {
      socket.join(`team:${teamId}`);
      console.log(`${socket.data.user.name} joined team ${teamId}`);
    });

    socket.on('leaveTeam', (teamId: string) => {
      socket.leave(`team:${teamId}`);
      console.log(`${socket.data.user.name} left team ${teamId}`);
    });

    socket.on('typing', (teamId: string) => {
      socket.to(`team:${teamId}`).emit('userTyping', {
        userId: socket.data.user._id,
        name: socket.data.user.name,
      });
    });

    socket.on('stopTyping', (teamId: string) => {
      socket.to(`team:${teamId}`).emit('userStoppedTyping', {
        userId: socket.data.user._id,
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.data.user.name);
    });
  });
}; 