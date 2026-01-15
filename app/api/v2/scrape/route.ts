import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { scrapeWebsite } from '@/lib/scraper';
import crypto from 'crypto';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

export async function GET() {
    return NextResponse.json({ status: 'API V2 is running' });
}

// Max duration for Vercel Serverless Functions (seconds)
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    console.log('>>> CAPTURE API V2 HIT');

    // Identify user from server-side session
    const cookieStore = await cookies();
    console.log('>>> V2 Cookies:', cookieStore.getAll().map(c => c.name));

    const supabaseAuth = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (e) {
                        // Handle case where we can't set cookies in this context
                    }
                },
                remove(name: string, options: any) {
                    try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch (e) {
                        // Handle case where we can't set cookies in this context
                    }
                },
            },
        }
    );

    let { data: { session } } = await supabaseAuth.auth.getSession();
    console.log('>>> V2 Session User (Cookie):', session?.user?.email);

    // Fallback to Header Auth if cookie failed
    if (!session) {
        const authHeader = req.headers.get('authorization');
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
            if (user && !error) {
                console.log('>>> V2 Session User (Header):', user.email);
                // Mock a session object since we have a user
                session = { user } as any;
            }
        }
    }

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    try {
        const body = await req.json().catch(() => ({}));
        const { url } = body;

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Generate ID manually (bypass schema select)
        const id = crypto.randomUUID();

        // Use AUTHENTICATED client to insert (ensures RLS respects user_id)
        const { error } = await supabaseAuth
            .from('websites')
            .insert({
                id,
                url,
                status: 'pending',
                user_id: session.user.id
            });

        if (error) {
            console.error('DB Error V2:', error);
            return NextResponse.json({ error: 'Database failed', details: error.message }, { status: 500 });
        }

        // Await scraper to prevent Vercel from freezing the process
        // This ensures data exists before we return
        try {
            // VERCEL OPTIMIZATION:
            // We set skipDownloads=true to perform FAST discovery (5-10s)
            // The frontend will then call /api/v2/scrape/assets to trigger background downloads
            await scrapeWebsite(id, url, true);
        } catch (err) {
            console.error('Scraper V2 Error:', err);
            // We still return 200 if DB insert worked, but status will be 'failed' 
            // The UI handles 'failed' status via polling or checks
        }

        return NextResponse.json({ id, message: 'Scrape initiated via v2' });

    } catch (error: any) {
        console.error('API V2 Fatal Error:', error);
        return NextResponse.json({ error: 'Process failed', details: error.message }, { status: 500 });
    }
}
