import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentAnalysis } from '@/lib/scraper-types';
import { BookOpen, Clock, FileText, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ContentAnalysisCardProps {
    analysis?: ContentAnalysis;
}

export function ContentAnalysisCard({ analysis }: ContentAnalysisCardProps) {
    if (!analysis || !analysis.readingTime) return null;

    return (
        <Card className="h-full bg-card/40 backdrop-blur-md border border-border/50 hover:border-border/80 transition-all duration-300 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-500" />
                    Content Intelligence
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4 flex-1 flex flex-col min-h-0">

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex flex-col items-center justify-center text-center">
                        <Clock className="w-6 h-6 text-green-500 mb-2" />
                        <span className="text-2xl font-bold tabular-nums">{analysis.readingTime}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Mins Read</span>
                    </div>
                    <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex flex-col items-center justify-center text-center">
                        <FileText className="w-6 h-6 text-orange-500 mb-2" />
                        <span className="text-2xl font-bold tabular-nums">{(analysis.wordCount || 0).toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Words</span>
                    </div>
                </div>

                {/* Byline */}
                {analysis.byline && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
                        <User className="w-4 h-4" />
                        <span className="truncate">Author: <span className="font-semibold text-foreground">{analysis.byline}</span></span>
                    </div>
                )}

                {/* Clean Text Preview */}
                {analysis.cleanText && (
                    <div className="space-y-2 flex-1 flex flex-col min-h-0">
                        <h4 className="text-sm font-semibold text-muted-foreground">Article Preview</h4>
                        <div className="rounded-md border bg-muted/30 p-4 h-48 md:h-64">
                            <ScrollArea className="h-full w-full pr-4">
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                    {analysis.cleanText.substring(0, 1500)}
                                    {analysis.cleanText.length > 1500 && '...'}
                                </p>
                            </ScrollArea>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
