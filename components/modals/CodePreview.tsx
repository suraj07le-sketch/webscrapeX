'use client';

import * as React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileCode, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    code: string;
    filename: string;
    language: string;
}

export function CodePreviewModal({ isOpen, onClose, code, filename, language }: CodePreviewModalProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden border-white/10 bg-[#0d1117]/95 backdrop-blur-3xl rounded-[2.5rem]">
                <DialogHeader className="p-8 pb-4 flex flex-row items-center justify-between border-b border-white/5 space-y-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10">
                            <FileCode className="w-5 h-5 text-primary" />
                        </div>
                        <DialogTitle className="text-lg font-mono truncate max-w-[400px]">
                            {filename}
                        </DialogTitle>
                    </div>
                    <button
                        onClick={copyToClipboard}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 flex items-center gap-2 text-xs font-medium"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy Code'}
                    </button>
                </DialogHeader>
                <ScrollArea className="flex-1 w-full bg-transparent">
                    <SyntaxHighlighter
                        language={language}
                        style={atomDark}
                        customStyle={{
                            background: 'transparent',
                            padding: '2rem',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            margin: 0
                        }}
                        showLineNumbers
                    >
                        {code}
                    </SyntaxHighlighter>
                </ScrollArea>
                <div className="p-4 border-t border-white/5 bg-background/50 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                        {language.toUpperCase()} • {code.length} characters
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                        Inspected with WebScrapeX
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
