'use client';

import type { ScrapedMetadata } from '@/lib/extractors/meta';
import type { DetectedTech } from '@/lib/extractors/tech';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface MetadataCardProps {
    metadata: ScrapedMetadata;
    technologies: DetectedTech[];
}

export default function MetadataCard({ metadata, technologies }: MetadataCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Website Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                    {metadata.favicon && (
                        <div className="shrink-0">
                            {/* Use standard img tag for simplicity with external URLs, or configure domains for Image */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={metadata.favicon} alt="Favicon" className="w-16 h-16 rounded border p-1" />
                        </div>
                    )}
                    <div>
                        <h3 className="font-bold text-xl">{metadata.title || 'No Title'}</h3>
                        <p className="text-sm text-slate-500 mt-1">{metadata.description || 'No description found.'}</p>
                    </div>
                </div>

                {technologies && technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {technologies.map((tech, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                                {tech.name}
                            </span>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
