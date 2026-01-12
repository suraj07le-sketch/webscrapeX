'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface Log {
    id: string;
    message: string;
    type: 'info' | 'error' | 'success' | 'warning';
    created_at: string;
}

export default function LogViewer({ websiteId }: { websiteId: string }) {
    const [logs, setLogs] = useState<Log[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial fetch
        const fetchLogs = async () => {
            const { data } = await supabase
                .from('logs')
                .select('*')
                .eq('website_id', websiteId)
                .order('created_at', { ascending: true });
            if (data) setLogs(data);
        };

        fetchLogs();

        // Subscribe to new logs
        const channel = supabase
            .channel('logs-channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'logs',
                    filter: `website_id=eq.${websiteId}`,
                },
                (payload) => {
                    setLogs((prev) => [...prev, payload.new as Log]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [websiteId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="bg-slate-950 text-slate-200 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto border border-slate-800 shadow-inner">
            <div className="space-y-1">
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-2">
                        <span className="text-slate-500 text-xs shrink-0">
                            {new Date(log.created_at).toLocaleTimeString()}
                        </span>
                        <span className={
                            log.type === 'error' ? 'text-red-400' :
                                log.type === 'success' ? 'text-green-400' :
                                    log.type === 'warning' ? 'text-yellow-400' :
                                        'text-slate-300'
                        }>
                            {log.type === 'info' && '> '}
                            {log.message}
                        </span>
                    </div>
                ))}
                {logs.length === 0 && (
                    <div className="text-slate-500 italic flex items-center gap-2">
                        <Loader2 className="animate-spin h-3 w-3" /> Waiting for logs...
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
