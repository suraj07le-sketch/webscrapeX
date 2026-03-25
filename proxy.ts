import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js 16 Proxy Function.
 */
export async function proxy(req: NextRequest) {
    return NextResponse.next();
}

export default proxy;

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
