import { NextRequest, NextResponse } from 'next/server';
import { downloadAssets } from '@/lib/scraper';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const maxDuration = 60; // Max allowed for downloading

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const supabaseAuth = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value; },
                set(name: string, value: string, options: any) { try { cookieStore.set({ name, value, ...options }); } catch (e) { } },
                remove(name: string, options: any) { try { cookieStore.set({ name, value: '', ...options }); } catch (e) { } },
            },
        }
    );

    let { data: { session } } = await supabaseAuth.auth.getSession();
    if (!session) {
        // Fallback Header Auth
        const authHeader = req.headers.get('authorization');
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            const { data: { user } } = await supabaseAuth.auth.getUser(token);
            if (user) session = { user } as any;
        }
    }

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, urls, url: referer } = body;

        if (!id || !urls || !Array.isArray(urls)) {
            return NextResponse.json({ error: 'Missing id or urls array' }, { status: 400 });
        }

        console.log(`[${id}] Starting asset download for ${urls.length} items...`);

        // Run the download process
        // Note: we pass the AUTHENTICATED client so RLS works
        const downloaded = await downloadAssets(id, urls, referer || '', supabaseAuth);

        return NextResponse.json({
            success: true,
            downloadedCount: downloaded.length,
            totalRequested: urls.length
        });

    } catch (error: any) {
        console.error('Asset Download Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
