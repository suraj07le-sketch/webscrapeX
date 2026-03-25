'use client';

import { useMemo, useState, useEffect } from 'react';
import {
    AreaChart, Area, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, XAxis, YAxis
} from 'recharts';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { TrendingUp, PieChart as PieIcon } from 'lucide-react';

interface AnalyticsDashboardProps {
    history: any[];
}

const COLORS = ['#7c3aed', '#db2777', '#059669', '#d97706', '#2563eb'];

function ChartLoader() {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        </div>
    );
}

export function AnalyticsDashboard({ history }: AnalyticsDashboardProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const chartData = useMemo(() => {
        if (!history || history.length === 0) return [];

        const groups = history.reduce((acc: any, item: any) => {
            const date = new Date(item.created_at).toLocaleDateString();
            if (!acc[date]) acc[date] = 0;
            acc[date]++;
            return acc;
        }, {});

        return Object.entries(groups).map(([name, value]) => ({ name, value })).reverse();
    }, [history]);

    const techData = useMemo(() => {
        if (!history) return [];
        const techs = history.flatMap(item => item.metadata?.technologies || []);
        const counts = techs.reduce((acc: any, t: string) => {
            acc[t] = (acc[t] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a: any, b: any) => b.value - a.value)
            .slice(0, 5);
    }, [history]);

    if (!history || history.length === 0) return null;

    return (
        <section className="w-full max-w-7xl z-10 px-4 space-y-8 mb-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                        Insights Engine
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Usage Analytics</h2>
                    <p className="text-xl text-muted-foreground/60 max-w-xl">
                        Visualizing your scraping patterns and tech stack trends.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <AnimatedCard variant="glass" tilt={false} className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-bold tracking-tight">Scrape activity</h3>
                    </div>
                    <div className="relative h-[300px]">
                        {!mounted && <ChartLoader />}
                        {mounted && (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '12px' }} />
                                    <Area type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </AnimatedCard>

                <AnimatedCard variant="glass" tilt={false}>
                    <div className="flex items-center gap-3 mb-8">
                        <PieIcon className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-lg font-bold tracking-tight">Top Technologies</h3>
                    </div>
                    <div className="relative h-[300px]">
                        {!mounted && <ChartLoader />}
                        {mounted && (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={techData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {techData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                    <div className="space-y-2 mt-4">
                        {techData.map((item: any, idx) => (
                            <div key={item.name} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                    <span className="text-muted-foreground">{item.name}</span>
                                </div>
                                <span className="font-bold">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </AnimatedCard>
            </div>
        </section>
    );
}
