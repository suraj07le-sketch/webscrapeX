'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileJson, FileArchive, ImageIcon, Palette, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrapeResult } from '@/lib/scraper-types';

interface FloatingExportButtonProps {
    data: ScrapeResult | null;
}

export function FloatingExportButton({ data }: FloatingExportButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleExport = (type: string) => {
        if (!data) return;

        switch (type) {
            case 'json':
                const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const jsonUrl = URL.createObjectURL(jsonBlob);
                const jsonLink = document.createElement('a');
                jsonLink.href = jsonUrl;
                jsonLink.download = `scrape-${data.metadata?.title || 'result'}.json`;
                document.body.appendChild(jsonLink);
                jsonLink.click();
                document.body.removeChild(jsonLink);
                URL.revokeObjectURL(jsonUrl);
                break;

            case 'images':
                // Fallback since we don't have ZIP capability client-side without libs
                const imgUrls = data.images?.map(img => img.url).join('\n') || 'No images found.';
                const imgBlob = new Blob([imgUrls], { type: 'text/plain' });
                const imgUrl = URL.createObjectURL(imgBlob);
                const imgLink = document.createElement('a');
                imgLink.href = imgUrl;
                imgLink.download = `image-links-${data.metadata?.title || 'result'}.txt`;
                document.body.appendChild(imgLink);
                imgLink.click();
                document.body.removeChild(imgLink);
                URL.revokeObjectURL(imgUrl);
                break;

            case 'colors':
                // Generate a simple HTML color guide
                const colorHtml = `
                    <html>
                    <head>
                        <title>Color Guide - ${data.metadata?.title}</title>
                        <style>
                            body { font-family: system-ui; padding: 40px; }
                            .color-card { display: flex; align-items: center; margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; }
                            .swatch { width: 80px; height: 80px; border-radius: 8px; margin-right: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                            .info { flex: 1; }
                            h1 { margin-bottom: 40px; }
                        </style>
                    </head>
                    <body>
                        <h1>Color Guide: ${data.metadata?.title}</h1>
                        ${data.colors?.map(c => `
                            <div class="color-card">
                                <div class="swatch" style="background-color: ${c}"></div>
                                <div class="info">
                                    <h3>${c}</h3>
                                </div>
                            </div>
                        `).join('') || '<p>No colors found.</p>'}
                    </body>
                    </html>
                 `;
                const colorBlob = new Blob([colorHtml], { type: 'text/html' });
                const colorUrl = URL.createObjectURL(colorBlob);
                const colorLink = document.createElement('a');
                colorLink.href = colorUrl;
                colorLink.download = `color-guide-${data.metadata?.title || 'result'}.html`;
                document.body.appendChild(colorLink);
                colorLink.click();
                document.body.removeChild(colorLink);
                URL.revokeObjectURL(colorUrl);
                break;

            case 'archive':
                // Full archive summary
                const readme = `
WebScrapeX Archive
==================
Title: ${data.metadata?.title}
URL: ${data.url}
Date: ${new Date().toISOString()}

Assets Summary:
- Images: ${data.images?.length || 0}
- Colors: ${data.colors?.length || 0}
- Fonts: ${data.fonts?.length || 0}
- CSS Files: ${data.cssFiles?.length || 0}
- JS Files: ${data.jsFiles?.length || 0}

Full raw data is available in the associated JSON export.
                 `;
                const archiveBlob = new Blob([readme], { type: 'text/plain' });
                const archiveUrl = URL.createObjectURL(archiveBlob);
                const archiveLink = document.createElement('a');
                archiveLink.href = archiveUrl;
                archiveLink.download = `archive-readme-${data.metadata?.title || 'result'}.txt`;
                document.body.appendChild(archiveLink);
                archiveLink.click();
                document.body.removeChild(archiveLink);
                URL.revokeObjectURL(archiveUrl);
                break;
        }
        setIsOpen(false);
    };

    const exportOptions = [
        { name: 'Export JSON', icon: FileJson, color: 'text-blue-400', action: 'json' },
        { name: 'Image Links (TXT)', icon: ImageIcon, color: 'text-emerald-400', action: 'images' },
        { name: 'Color Guide (HTML)', icon: Palette, color: 'text-purple-400', action: 'colors' },
        { name: 'Archive Summary', icon: FileArchive, color: 'text-orange-400', action: 'archive' },
    ];

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 flex flex-col gap-2"
                    >
                        {exportOptions.map((option, i) => (
                            <motion.button
                                key={option.name}
                                onClick={() => handleExport(option.action)}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-background/80 backdrop-blur-2xl border border-white/10 shadow-2xl hover:bg-white/5 transition-all text-sm font-medium whitespace-nowrap group"
                            >
                                <option.icon className={cn("w-4 h-4", option.color)} />
                                <span>{option.name}</span>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronUp className="w-3 h-3 rotate-90" />
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                disabled={!data}
                className={cn(
                    "w-14 h-14 rounded-2xl shadow-2xl shadow-primary/20 transition-all duration-300 transform",
                    isOpen ? "rotate-90 bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90",
                    !data && "opacity-50 cursor-not-allowed"
                )}
            >
                <Download className={cn("w-6 h-6 transition-transform", isOpen ? "scale-0" : "scale-100")} />
                <div className={cn("absolute inset-0 flex items-center justify-center transition-transform", isOpen ? "scale-100" : "scale-0")}>
                    <div className="w-6 h-0.5 bg-white rotate-45 absolute" />
                    <div className="w-6 h-0.5 bg-white -rotate-45 absolute" />
                </div>
            </Button>
        </div>
    );
}
