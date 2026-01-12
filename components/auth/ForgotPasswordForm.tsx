'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/update-password`,
            });

            if (error) throw error;
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Reset request failed');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center space-y-8 py-12">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-primary/20"
                >
                    <Mail className="w-10 h-10 text-primary" />
                </motion.div>
                <h2 className="text-3xl font-black tracking-tight">Reset link sent</h2>
                <p className="text-muted-foreground/60 leading-relaxed font-medium">
                    If an account exists for <br /> <span className="text-foreground font-bold">{email}</span>, <br /> you'll receive a link shortly.
                </p>
                <div className="pt-10">
                    <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Return to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleReset} className="space-y-8">
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-5 rounded-2xl bg-destructive/5 border border-destructive/10 text-destructive text-sm flex items-center gap-4"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-3">
                <p className="text-xs text-muted-foreground/40 leading-relaxed text-center px-4 font-black uppercase tracking-widest">
                    Recovery Access
                </p>
                <div className="relative group">
                    <motion.div animate={{ opacity: email ? 1 : 0.4 }} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-all z-10">
                        <Mail className="w-5 h-5" />
                    </motion.div>
                    <Input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:bg-white/10 focus:border-primary/50 transition-all text-sm ring-offset-transparent"
                        required
                    />
                    <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity -z-10" />
                </div>
            </div>

            <AnimatedButton
                type="submit"
                className="w-full h-14 rounded-2xl shadow-lg shadow-primary/20 text-base font-black group transition-all mt-4"
                disabled={loading}
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <div className="flex items-center gap-2">
                        <span>Send Code</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                )}
            </AnimatedButton>

            <div className="text-center pt-4">
                <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-foreground transition-all">
                    <ArrowLeft className="w-3 h-3" />
                    Return to Sign In
                </Link>
            </div>
        </form>
    );
}
