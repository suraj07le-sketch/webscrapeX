'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Bell, Globe, X, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ScheduleScrapeModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
}

export function ScheduleScrapeModal({ isOpen, onClose, url }: ScheduleScrapeModalProps) {
    const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const [webhookUrl, setWebhookUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-card border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="p-6 md:p-8 space-y-8">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                                    <Calendar className="w-6 h-6 text-primary" />
                                    Schedule Scrape
                                </h3>
                                <p className="text-sm text-muted-foreground/60 truncate max-w-[300px]">
                                    {url}
                                </p>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Frequency Selection */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Frequency</label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                                    <button
                                        key={freq}
                                        onClick={() => setFrequency(freq)}
                                        className={cn(
                                            "px-4 py-3 rounded-2xl border text-sm font-bold capitalize transition-all",
                                            frequency === freq 
                                                ? "bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(124,58,237,0.1)]" 
                                                : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                                        )}
                                    >
                                        {freq}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Webhook Configuration */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Webhook Notification</label>
                                <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Feature 4</span>
                            </div>
                            <div className="relative group">
                                <Bell className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="url"
                                    placeholder="https://your-api.com/webhook"
                                    value={webhookUrl}
                                    onChange={(e) => setWebhookUrl(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-medium"
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground/40 italic">
                                We'll POST the scrape results to this URL as soon as the job completes.
                            </p>
                        </div>

                        {/* Options */}
                        <div className="space-y-4 pt-4 border-t border-white/10">
                            {[
                                { icon: Globe, label: "Enable Proxy Rotation", active: true },
                                { icon: Zap, label: "AI Extraction Auto-Prompt", active: false }
                            ].map((opt, i) => (
                                <div key={i} className="flex items-center justify-between opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0 cursor-not-allowed">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-white/5">
                                            <opt.icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-bold">{opt.label}</span>
                                    </div>
                                    <div className="w-10 h-5 rounded-full bg-white/10 relative">
                                        <div className="absolute left-1 top-1 w-3 h-3 rounded-full bg-white/20" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full py-8 text-lg font-black tracking-tighter rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                        >
                            {isSubmitting ? "Configuring Engine..." : "Activate Schedule"}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
