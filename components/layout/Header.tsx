'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    Search,
    Share2,
    Download,
    ChevronRight,
    Home,
    Command
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion } from 'framer-motion';
import { CommandMenu } from '@/components/CommandMenu';

export function Header({ title, url, favicon }: { title?: string, url?: string, favicon?: string }) {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl transition-all duration-300">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <div className="hidden xs:flex items-center bg-white/5 rounded-lg border border-white/10 p-1.5">
                        <Home className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <ChevronRight className="hidden xs:block w-4 h-4 text-muted-foreground/30" />
                    <div className="text-sm font-bold flex items-center gap-2 overflow-hidden">
                        <span className="text-muted-foreground hidden sm:block">Scrapes</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/30 hidden sm:block" />
                        {favicon && (
                            <img
                                src={favicon}
                                alt=""
                                className="w-4 h-4 rounded"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        )}
                        <span className="text-foreground max-w-[120px] sm:max-w-[200px] truncate">
                            {title && !['Untitled', 'No Title', 'Untitled Scrape', 'Untitiled Scrape', 'Analysis'].includes(title)
                                ? title
                                : (url ? new URL(url).hostname : 'Analysis')}
                        </span>
                    </div>
                </div>

                {/* Search / Command K Bar */}
                <div className="flex-1 max-w-md mx-2 sm:mx-8 hidden md:block">
                    <CommandMenu />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    {url && (
                        <div className="hidden xl:block px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono text-muted-foreground/60 max-w-[200px] truncate">
                            {url}
                        </div>
                    )}
                    <ThemeToggle />
                    <Button variant="outline" size="sm" className="rounded-xl bg-white/5 border-white/10 hover:bg-white/10 h-10 w-10 sm:w-auto px-0 sm:px-4">
                        <Share2 className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Share</span>
                    </Button>
                    <Button size="sm" className="rounded-xl shadow-lg shadow-primary/20 h-10 w-10 sm:w-auto px-0 sm:px-4">
                        <Download className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Export</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
