'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

export function SignUpForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    }
                }
            });

            if (error) throw error;
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Registration failed');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center space-y-8 py-12">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-emerald-500/20"
                >
                    <Mail className="w-10 h-10 text-emerald-500" />
                </motion.div>
                <h2 className="text-3xl font-black tracking-tight">Check your inbox</h2>
                <p className="text-muted-foreground/60 leading-relaxed font-medium">
                    We've sent a magic link to <br /> <span className="text-primary font-bold">{email}</span>.
                </p>
                <AnimatedButton onClick={() => router.push('/login')} variant="outline" className="w-full h-16 rounded-[1.25rem] mt-10">
                    Proceed to Login
                </AnimatedButton>
            </div>
        );
    }

    return (
        <form onSubmit={handleSignUp} className="space-y-8">
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-5 rounded-2xl bg-destructive/5 border border-destructive/10 text-destructive text-sm flex items-center gap-4"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-3">
                <div className="relative group">
                    <motion.div animate={{ opacity: name ? 1 : 0.4 }} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-all z-10">
                        <User className="w-5 h-5" />
                    </motion.div>
                    <Input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:bg-white/10 focus:border-primary/50 transition-all text-sm ring-offset-transparent"
                        required
                    />
                    <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity -z-10" />
                </div>

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

                <div className="relative group">
                    <motion.div animate={{ opacity: password ? 1 : 0.4 }} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-all z-10">
                        <Lock className="w-5 h-5" />
                    </motion.div>
                    <Input
                        type="password"
                        placeholder="Create Secure Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:bg-white/10 focus:border-primary/50 transition-all text-sm ring-offset-transparent"
                        required
                    />
                    <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity -z-10" />
                </div>
            </div>

            <AnimatedButton
                type="submit"
                className="w-full h-14 rounded-2xl shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)] text-base font-black group transition-all mt-4"
                disabled={loading}
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <div className="flex items-center gap-2">
                        <span>Begin Journey</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                )}
            </AnimatedButton>
        </form>
    );
}
