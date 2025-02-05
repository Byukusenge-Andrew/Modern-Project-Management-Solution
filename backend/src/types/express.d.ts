import { Request } from 'express';
import { IUser } from './IUser'; // Adjust the path to your IUser interface

export interface IGetUserAuthInfoRequest extends Request {
  user?: IUser; // Make user optional
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Ensure this matches the middleware usage
    }
  }
}
