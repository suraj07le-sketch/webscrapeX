import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const url = new URL(req.url);
    // Skip static files immediately
    if (url.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|webmanifest|json)$/)) {
        return NextResponse.next();
    }

    let res = NextResponse.next({
        request: {
            headers: req.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return req.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    req.cookies.set({ name, value, ...options });
                    res = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    });
                    res.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: any) {
                    req.cookies.set({ name, value: '', ...options });
                    res = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    });
                    res.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // const url = new URL(req.url); // Already declared above

    // Whitelist public routes
    if (url.pathname === '/' || url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) {
        return res;
    }

    // Protected routes: Only admin pages strictly require auth for now
    // We allow guests to see result pages so they can test the scraper
    if (url.pathname.startsWith('/admin/') && !session) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Redirect logged in users away from auth pages
    if ((url.pathname === '/login' || url.pathname === '/signup') && session) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return res;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * And specific file extensions
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
