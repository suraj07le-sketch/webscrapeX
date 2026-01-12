'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, LucideIcon, FileCode, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { CodePreviewModal } from '@/components/modals/CodePreview';

interface ScrapeFile {
    name: string;
    size: number;
    content?: string;
}

interface AssetsCardProps {
    title: string;
    icon: LucideIcon;
    iconColor: string;
    files: ScrapeFile[];
}

export function AssetsCard({ title, icon: Icon, iconColor, files }: AssetsCardProps) {
    const [selectedFile, setSelectedFile] = useState<{ code: string, filename: string, language: string } | null>(null);

    if (!files || files.length === 0) return null;

    return (
        <Card className="rounded-[2rem] border border-white/10 bg-card/40 backdrop-blur-2xl shadow-2xl h-full transition-all duration-500">
            <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                    {title} ({files.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-2">
                <div className="space-y-2">
                    {files.slice(0, 10).map((file, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2 rounded-lg bg-white/5">
                                    <FileCode className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-medium truncate text-muted-foreground group-hover:text-foreground transition-colors">
                                        {file.name.split('/').pop()}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground/40 font-mono">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSelectedFile({
                                        code: file.content || `/* Code preview for ${file.name} */\n\n// Content loading...\n\nbody {\n  background: #000;\n  color: #fff;\n}`,
                                        filename: file.name.split('/').pop() || 'file',
                                        language: title.toLowerCase().includes('css') ? 'css' : 'javascript'
                                    })}
                                    className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-primary transition-all md:opacity-0 group-hover:opacity-100"
                                    title="Preview Code"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                                <a
                                    href={file.name}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {files.length > 10 && (
                    <p className="mt-4 text-xs text-muted-foreground text-center font-medium">
                        + {files.length - 10} more assets
                    </p>
                )}

                {selectedFile && (
                    <CodePreviewModal
                        isOpen={!!selectedFile}
                        onClose={() => setSelectedFile(null)}
                        code={selectedFile.code}
                        filename={selectedFile.filename}
                        language={selectedFile.language}
                    />
                )}
            </CardContent>
        </Card>
    );
}
