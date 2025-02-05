import { Request, Response, RequestHandler, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { IUser} from '../types';
import { AuthRequest } from '../types/express-session';

interface CustomRequest extends Request {
  user: IUser & { createdAt: Date; updatedAt: Date; };
}
// }

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
};

export const register = async (req: any, res: any) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    }) as IUser;

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login: RequestHandler = async (req:AuthRequest, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }) as IUser;
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

   
    // Store user ID in session
    req.session.user = { userId: user._id.toString() };
  

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as CustomRequest).user;

    const userProfile = await User.findById(user._id)
      .select('-password')
      .populate('teams', 'name');

    if (!userProfile) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(userProfile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as CustomRequest).user;

    const userToUpdate = await User.findById(user._id);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    userToUpdate.name = req.body.name || userToUpdate.name;
    userToUpdate.email = req.body.email || userToUpdate.email;

    if (req.body.password) {
      userToUpdate.password = req.body.password;
    }

    const updatedUser = await userToUpdate.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id.toString()),
    });
  } catch (error) {
    next(error);
  }
};