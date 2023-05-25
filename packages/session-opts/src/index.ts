import { IronSession, IronSessionOptions } from "iron-session";

export type SessionData = IronSession & { userId?: number, userName?: string, tenantId?: number, tenantName?: string, isAdmin?: boolean, authenticated?: boolean; };

export const getSessionOpts = (): IronSessionOptions => ({
    password: process.env.COOKIE_SECRET as string,
    cookieName: process.env.COOKIE_NAME as string,
    cookieOptions: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/'
    },
});