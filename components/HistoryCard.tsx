'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink, Calendar, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ScrapeHistoryItem {
    id: string;
    url: string;
    created_at: string;
    metadata?: {
        title: string;
        favicon: string;
        color_palette?: string[];
    };
}

export function HistoryCard({ item }: { item: ScrapeHistoryItem }) {
    const primaryColor = item.metadata?.color_palette?.[0] || 'var(--primary)';

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <Link href={`/result/${item.id}`}>
                <Card className="h-full overflow-hidden border-border/50 bg-card/40 backdrop-blur-xl relative group">
                    {/* Hover Accent Glow */}
                    <div
                        className="absolute inset-x-0 bottom-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: primaryColor }}
                    />

                    <CardContent className="p-5 space-y-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <img
                                    src={item.metadata?.favicon || `https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}&sz=128`}
                                    alt=""
                                    className="w-10 h-10 rounded-lg shadow-sm bg-background/50 p-1 object-contain"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        if (!target.src.includes('google.com')) {
                                            target.src = `https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}&sz=128`;
                                        } else {
                                            target.style.display = 'none';
                                            target.nextElementSibling?.classList.remove('hidden');
                                        }
                                    }}
                                />
                                {/* Fallback Icon */}
                                <div className="hidden w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <ExternalLink className="w-5 h-5 text-primary" />
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-base truncate leading-tight group-hover:text-primary transition-colors">
                                        {item.metadata?.title &&
                                            !['Untitled', 'No Title', 'Untitled Scrape', 'Untitiled Scrape'].includes(item.metadata.title)
                                            ? item.metadata.title
                                            : new URL(item.url).hostname}
                                    </h3>
                                    <p className="text-xs text-muted-foreground truncate font-mono">
                                        {item.url}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground/70">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" />
                                {new Date(item.created_at).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </div>
                            <div className="flex items-center gap-1 group-hover:text-primary transition-colors font-semibold uppercase tracking-wider">
                                View Full Analysis <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}
