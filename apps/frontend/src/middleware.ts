import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { SessionData, getSessionOpts } from 'session-opts';
import { getIronSession } from 'iron-session/edge';

const redirectCheck = (req: NextRequest, res: NextResponse, path: string) => {
    if (req.nextUrl.pathname !== path) {
        return NextResponse.redirect(new URL(path, req.url));
    }
    return res;
};

export async function middleware(req: NextRequest) {
    let res = NextResponse.next();



    if (!req.nextUrl.pathname.includes('_next')) {

        const sessionOpts = getSessionOpts();

        const session: SessionData = await getIronSession(req, res, sessionOpts);

        if (!session.authenticated) {
            res = redirectCheck(req, res, '/login');
        }
    }

    return res;
}