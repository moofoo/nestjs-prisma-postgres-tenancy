import { Request, Response, NextFunction } from 'express';
import { getIronSession } from 'iron-session';
import { SessionData, getSessionOpts } from 'session-opts';

export async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
      const session: SessionData = await getIronSession(req, res, getSessionOpts());
      (req as any).session = session;
      next();
};
