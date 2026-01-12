'use client';

import { supabase } from '@/lib/supabase';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Chrome } from 'lucide-react';
import { useState } from 'react';

export function SocialAuth() {
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error logging in with Google:', error);
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0c0c0c] px-4 text-muted-foreground/30 font-black tracking-[0.2em]">
                        Gateway
                    </span>
                </div>
            </div>

            <AnimatedButton
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full h-16 rounded-[1.25rem] bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 text-foreground flex items-center justify-center gap-4 group transition-all duration-500 overflow-hidden relative"
                disabled={loading}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                    <Chrome className="w-5 h-5 group-hover:text-primary transition-colors" />
                </div>
                <span className="font-bold tracking-tight">Login with Google</span>
            </AnimatedButton>
        </div>
    );
}
