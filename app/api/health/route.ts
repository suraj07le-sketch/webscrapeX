import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET() {
    try {
        const startTime = Date.now();
        
        // Test database connectivity
        const { error: dbError } = await supabase
            .from('websites')
            .select('id')
            .limit(1);
        
        if (dbError) {
            throw new Error(`Database error: ${dbError.message}`);
        }
        
        // Test storage connectivity if admin client available
        let storageHealthy = true;
        if (supabaseAdmin) {
            try {
                const { error: storageError } = await supabaseAdmin.storage
                    .from('scrapes')
                    .list('', { limit: 1 });
                
                if (storageError) {
                    storageHealthy = false;
                }
            } catch (e) {
                storageHealthy = false;
            }
        }
        
        const responseTime = Date.now() - startTime;
        
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            responseTime: `${responseTime}ms`,
            services: {
                database: 'healthy',
                storage: storageHealthy ? 'healthy' : 'degraded'
            },
            environment: process.env.NODE_ENV || 'development',
            version: process.env.npm_package_version || 'unknown'
        };
        
        return NextResponse.json(health, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
    } catch (error) {
        const health = {
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error',
            services: {
                database: 'unknown',
                storage: 'unknown'
            }
        };
        
        return NextResponse.json(health, {
            status: 503,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        });
    }
}