import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { scrapeWebsite } from '@/lib/scraper';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function GET() {
    return NextResponse.json({ status: 'API V2 is running' });
}

export async function POST(req: NextRequest) {
    console.log('>>> CAPTURE API V2 HIT');
    try {
        const body = await req.json().catch(() => ({}));
        const { url } = body;

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Generate ID manually (bypass schema select)
        const id = crypto.randomUUID();

        // Use guest-friendly insert (no user_id)
        const { error } = await (supabase as any)
            .from('websites')
            .insert({
                id,
                url,
                status: 'pending'
            });

        if (error) {
            console.error('DB Error V2:', error);
            return NextResponse.json({ error: 'Database failed', details: error.message }, { status: 500 });
        }

        // Await scraper to prevent Vercel from freezing the process
        // This ensures data exists before we return
        try {
            await scrapeWebsite(id, url);
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
