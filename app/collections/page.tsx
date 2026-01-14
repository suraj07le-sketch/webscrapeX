'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/hooks/useAuth';
import { DynamicBackground } from '@/components/ui/DynamicBackground';
import { Sidebar } from '@/components/layout/Sidebar';
import { HistoryCard } from '@/components/HistoryCard';
import { ScrollFadeIn } from '@/components/ui/MotionWrappers';
import { History, LayoutGrid, Clock, Calendar } from 'lucide-react';

export default function CollectionsPage() {
    const { session } = useAuth();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Create authenticated client
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const fetchHistory = async () => {
            if (!session?.user) return; // Wait for session

            const { data, error } = await supabase
                .from('websites')
                .select(`
                    id,
                    url,
                    created_at,
                    metadata (
                        title,
                        favicon
                    ),
                    assets (
                        url
                    )
                `)
                .eq('user_id', session.user.id)
                .eq('status', 'completed')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setHistory(data.map((item: any) => ({
                    ...item,
                    metadata: Array.isArray(item.metadata) ? item.metadata[0] : item.metadata,
                    thumbnail: item.assets?.[0]?.url || (Array.isArray(item.metadata) ? item.metadata[0]?.favicon : item.metadata?.favicon) || null
                })));
            }
            setLoading(false);
        };

        if (session) {
            fetchHistory();
        }
    }, [session]);

    const handleDelete = async (id: string) => {
        setHistory(prev => prev.filter(item => item.id !== id));

        const { error } = await supabase
            .from('websites')
            .delete()
            .eq('id', id)
            .eq('user_id', session?.user?.id); // Extra safety

        if (error) {
            console.error('Delete failed:', error);
            // Optionally revert state here if needed, but optimistic UI is better
        }
    };

    return (
        <div className="min-h-screen bg-transparent font-sans relative flex items-stretch overflow-x-hidden text-foreground">
            <DynamicBackground colors={[]} />
            <Sidebar />

            <div className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-7xl mx-auto space-y-12"
                >
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                            <History className="w-3 h-3" />
                            Archive
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Your Collections</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            A complete archive of all your scraped websites and design systems.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 border-b border-white/10 pb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                        <div className="flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4" />
                            <span>{history.length} Total Items</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Sorted by Date</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-[300px] w-full rounded-3xl bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {history.map((item, idx) => (
                                <ScrollFadeIn key={item.id} delay={idx * 0.05}>
                                    <HistoryCard item={item} onDelete={handleDelete} />
                                </ScrollFadeIn>
                            ))}
                        </div>
                    )}

                    {!loading && history.length === 0 && (
                        <div className="text-center py-24 text-muted-foreground">
                            <p>No collections found. Start capturing websites to build your library.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
