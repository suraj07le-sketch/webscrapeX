import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Verify Session
    // Verify Session
    const cookieStore = await cookies();
    const supabaseAuth = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    try { cookieStore.set({ name, value, ...options }); } catch (e) { }
                },
                remove(name: string, options: any) {
                    try { cookieStore.set({ name, value: '', ...options }); } catch (e) { }
                },
            },
        }
    );
    let { data: { session } } = await supabaseAuth.auth.getSession();

    // Fallback to Header Auth
    if (!session) {
        const authHeader = req.headers.get('authorization');
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
            if (user && !error) {
                session = { user } as any;
            }
        }
    }

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Use Admin client if available (bypasses RLS), otherwise use the Authenticated User client
        // DO NOT use vanilla 'supabase' because it lacks the session context!
        const client = supabaseAdmin || supabaseAuth;

        // Check ownership first - use client here too for consistency!
        const { data: websiteData, error: webError } = await client
            .from('websites')
            .select('id, url, user_id')
            .eq('id', id)
            .single();

        const website = websiteData as any;

        if (webError || !website) {
            console.error('Website 404:', { id, webError });
            return NextResponse.json({ error: 'Website not found' }, { status: 404 });
        }

        if (website.user_id !== session.user.id) {
            console.error('Forbidden Access Debug:', {
                websiteId: website.id,
                websiteOwner: website.user_id,
                sessionUser: session.user.id,
                sessionEmail: session.user.email,
                clientType: supabaseAdmin ? 'Admin' : 'AuthenticatedUser'
            });
            return NextResponse.json({
                error: 'Forbidden',
                debug: { expected: website.user_id, actual: session.user.id }
            }, { status: 403 });
        }

        // Fetch Metadata
        const { data: rawMetadata, error: metaError } = await client
            .from('metadata')
            .select('*')
            .eq('website_id', id)
            .single();

        const metadata = rawMetadata as any; // Cast to any to prevent TS errors

        if (metaError || !metadata) {
            console.error('Metadata 404:', { id, metaError });
            return NextResponse.json({ error: 'Content not found' }, { status: 404 });
        }

        // Fetch Images from Assets table
        const { data: imageAssets } = await client
            .from('assets')
            .select('url')
            .eq('website_id', id)
            .eq('file_type', 'image');

        // 1. Try to fetch the full result.json from Storage (Best Source)
        try {
            const { data: jsonData, error: downloadError } = await client.storage
                .from('scrapes')
                .download(`${id}/result.json`);

            if (jsonData && !downloadError) {
                const text = await jsonData.text();
                const fullResult = JSON.parse(text);
                return NextResponse.json(fullResult);
            }
        } catch (e) {
            // Ignore storage fetch error, fallback to DB
            console.log('Storage lookup failed, falling back to DB...');
        }

        // 2. Fallback: Reconstruct from DB (Legacy/Backup)
        const result = {
            url: website?.url || '',
            metadata: {
                title: metadata.title || '',
                description: metadata.description || '',
                keywords: Array.isArray(metadata.keywords)
                    ? metadata.keywords
                    : (typeof metadata.keywords === 'string' ? metadata.keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0) : []),
                favicon: metadata.favicon || ''
            },
            colors: metadata.color_palette || [],
            fonts: metadata.fonts || [],
            images: (imageAssets || []).map((asset: any) => ({ url: asset.url })),
            technologies: metadata.technologies || [],
            // These fields might be empty if not stored in DB, but this prevents the 500 crash
            cssFiles: [],
            jsFiles: [],
            html: '',
            links: [],
            rawAssets: []
        };

        return NextResponse.json(result);

    } catch (error) {
        console.error('Content API Error:', error);
        return NextResponse.json({ error: 'Failed to retrieve content' }, { status: 500 });
    }
}
