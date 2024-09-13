import 'express'
import 'express-session'

declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      email: string;
      username: string;
      role: string;
    };
  }
}
