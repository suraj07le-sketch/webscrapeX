import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    try {
        const scrapeDir = path.resolve(process.cwd(), 'tmp', 'scrapes', id);
        const resultPath = path.join(scrapeDir, 'result.json');

        // Check if full result exists
        try {
            await fs.access(resultPath);
            const content = await fs.readFile(resultPath, 'utf-8');
            return NextResponse.json(JSON.parse(content));
        } catch {
            // Fallback to content.json for legacy or partial
            const contentPath = path.join(scrapeDir, 'content.json');
            await fs.access(contentPath);
            const content = await fs.readFile(contentPath, 'utf-8');
            return NextResponse.json(JSON.parse(content));
        }

    } catch (error) {
        return NextResponse.json({ error: 'Failed to retrieve content' }, { status: 500 });
    }
}
