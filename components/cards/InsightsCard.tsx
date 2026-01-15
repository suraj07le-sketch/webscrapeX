'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, TrendingUp, ShieldCheck, Gauge } from "lucide-react"
import { motion } from "framer-motion"

interface InsightsProps {
    colors: string[];
    techs: string[];
    metadata: {
        title: string;
        description: string;
    };
    designIntelligence?: {
        visualCohesion: string;
        technicalMaturity: string;
        seoReadiness: number;
    };
}

export function InsightsCard({ colors, techs, metadata, designIntelligence }: InsightsProps) {
    // Basic heuristics for "Design Style"
    const isDark = colors.some(c => {
        const lower = c.toLowerCase();
        return lower === '#000000' || lower.includes('black') || lower.includes('212121');
    });

    const isMinimal = colors.length < 5 && techs.includes('Tailwind CSS');

    // Use backend data if available, otherwise heuristic
    const seoScore = designIntelligence?.seoReadiness ?? ((metadata.title ? 40 : 0) + (metadata.description ? 40 : 0) + (metadata.title.length > 50 ? 20 : 0));
    const visualValue = designIntelligence?.visualCohesion ?? (colors.length > 5 ? 'Vibrant' : 'Unified');
    const techValue = designIntelligence?.technicalMaturity ?? (techs.length > 3 ? 'Advanced' : 'Modern');

    const stages = [
        { label: 'Visual Cohesion', value: visualValue, icon: Sparkles, color: 'text-blue-500' },
        { label: 'Technical Maturity', value: techValue, icon: Gauge, color: 'text-purple-500' },
        { label: 'SEO Readiness', value: `${seoScore}%`, icon: ShieldCheck, color: 'text-emerald-500' },
    ];

    return (
        <Card className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-primary/10 via-card/40 to-card/40 backdrop-blur-2xl shadow-2xl h-full transition-all duration-500">
            <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Design Intelligence
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-2 space-y-8">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                    <p className="text-sm italic text-muted-foreground/90 leading-relaxed">
                        "The design appears to be <span className="text-primary font-bold">{isMinimal ? 'Minimalist' : 'Rich'}</span> and
                        <span className="text-purple-400 font-bold"> {isDark ? 'Dark-Themed' : 'Light-Themed'}</span>.
                        It utilizes a <span className="text-cyan-400 font-bold">{techs[0] || 'Modern'}</span> stack which suggests a focus on performance and developer experience."
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {stages.map((stage, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl bg-background/50 ${stage.color} group-hover:scale-110 transition-transform`}>
                                    <stage.icon className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">{stage.label}</span>
                            </div>
                            <span className="font-bold text-sm tracking-tight">{stage.value}</span>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
