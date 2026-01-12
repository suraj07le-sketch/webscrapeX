'use client';

import { AuthCard } from '@/components/auth/AuthCard';
import { LoginForm } from '@/components/auth/LoginForm';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { DynamicBackground } from '@/components/ui/DynamicBackground';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#050505]">
            {/* Cinematic Background Auras */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/10 blur-[160px] rounded-full -z-10 animate-pulse" />
            <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full -z-10" />
            <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10" />

            {/* Subtle Grid Pattern overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none -z-10" />

            <AuthCard
                title="Welcome Back"
                subtitle="Sign in to your WebScrapeX account"
            >
                <LoginForm />

                <div className="mt-6 text-center">
                    <p className="text-xs font-medium text-muted-foreground/40 uppercase tracking-widest">
                        New here?{' '}
                        <Link href="/signup" className="text-primary font-black hover:opacity-80 transition-opacity ml-1">
                            Join Free
                        </Link>
                    </p>
                </div>
            </AuthCard>
        </main>
    );
}
