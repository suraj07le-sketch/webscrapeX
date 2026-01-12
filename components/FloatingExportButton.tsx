'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileJson, FileArchive, ImageIcon, Palette, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function FloatingExportButton() {
    const [isOpen, setIsOpen] = useState(false);

    const exportOptions = [
        { name: 'Export JSON', icon: FileJson, color: 'text-blue-400' },
        { name: 'Download Images (ZIP)', icon: ImageIcon, color: 'text-emerald-400' },
        { name: 'Color Guide (PDF)', icon: Palette, color: 'text-purple-400' },
        { name: 'Full Archive', icon: FileArchive, color: 'text-orange-400' },
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
                className={cn(
                    "w-14 h-14 rounded-2xl shadow-2xl shadow-primary/20 transition-all duration-300 transform",
                    isOpen ? "rotate-90 bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
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
