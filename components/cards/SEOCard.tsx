'use client';

import { SEOAudit } from '@/lib/extractors/seo';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { CheckCircle2, AlertCircle, XCircle, BarChart3, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface SEOCardProps {
    seo?: SEOAudit;
}

export function SEOCard({ seo }: SEOCardProps) {
    if (!seo) return null;

    return (
        <AnimatedCard variant="glass" className="h-full">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <BarChart3 className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">SEO Audit</h3>
                </div>
                <div className="flex flex-col items-end">
                    <span className={cn(
                        "text-3xl font-black tracking-tighter",
                        seo.score >= 90 ? "text-emerald-500" : seo.score >= 70 ? "text-yellow-500" : "text-destructive"
                    )}>
                        {seo.score}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Score</span>
                </div>
            </div>

            <div className="space-y-6">
                {/* Findings */}
                <div className="space-y-3">
                    {seo.findings.map((finding, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                            <div className="mt-0.5">
                                {finding.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                {finding.status === 'warn' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                                {finding.status === 'fail' && <XCircle className="w-4 h-4 text-destructive" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-sm font-bold">{finding.title}</span>
                                    <span className={cn(
                                        "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full",
                                        finding.impact === 'high' ? "bg-destructive/20 text-destructive" : 
                                        finding.impact === 'medium' ? "bg-yellow-500/20 text-yellow-500" : 
                                        "bg-emerald-500/20 text-emerald-500"
                                    )}>
                                        {finding.impact} Impact
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground/60 leading-relaxed">{finding.message}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Images w/o Alt</span>
                        <div className="text-sm font-bold flex items-center gap-2">
                            <span className={seo.metrics.imagesWithoutAlt > 0 ? "text-destructive" : "text-emerald-500"}>
                                {seo.metrics.imagesWithoutAlt}
                            </span>
                            <span className="text-muted-foreground/20">/</span>
                            <span>{seo.metrics.totalImages}</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">H1 Tags</span>
                        <div className={cn(
                            "text-sm font-bold",
                            seo.metrics.h1Count === 1 ? "text-emerald-500" : "text-yellow-500"
                        )}>
                            {seo.metrics.h1Count}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">OpenGraph</span>
                        <div className={cn(
                            "text-sm font-bold",
                            seo.metrics.hasOgTags ? "text-emerald-500" : "text-muted-foreground/40"
                        )}>
                            {seo.metrics.hasOgTags ? 'Present' : 'Missing'}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Schema Markup</span>
                        <div className={cn(
                            "text-sm font-bold",
                            seo.metrics.hasSchemaOrg ? "text-emerald-500" : "text-muted-foreground/40"
                        )}>
                            {seo.metrics.hasSchemaOrg ? 'Detected' : 'Not Found'}
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedCard>
    );
}
