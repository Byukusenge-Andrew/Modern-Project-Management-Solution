import session from 'express-session';
import { Request } from 'express';
import { Session } from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

// Define a custom session type with userId
export type SessionWithUserId = Session & { userId?: string };

// Define a custom request type that includes the custom session
export type AuthRequest = Request & {
  session: SessionWithUserId;
};