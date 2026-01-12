'use client';

import { useAuth } from '@/hooks/useAuth';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/ui/input';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Activity,
    Settings,
    ShieldCheck,
    Lock,
    ArrowLeft,
    Zap,
    History
} from 'lucide-react';
import { DynamicBackground } from '@/components/ui/DynamicBackground';
import Link from 'next/link';

export default function AdminPage() {
    const { user, loading, isAdmin } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminName, setAdminName] = useState('');
    const [adminPass, setAdminPass] = useState('');
    const [error, setError] = useState('');

    // Hardcoded credentials as requested
    const ADMIN_CREDENTIALS = {
        name: 'suraj',
        pass: 'Gj27an0057@@'
    };

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (adminName === ADMIN_CREDENTIALS.name && adminPass === ADMIN_CREDENTIALS.pass) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Invalid administrative credentials.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden text-center">
                <DynamicBackground colors={[]} />
                <AuthCard
                    title="Console Access"
                    subtitle="Administrative verification required"
                    className="border-primary/20 bg-primary/5"
                >
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <ShieldCheck className="w-10 h-10 text-primary" />
                    </div>

                    <form onSubmit={handleAdminLogin} className="space-y-4">
                        {error && (
                            <p className="text-destructive text-sm font-bold bg-destructive/10 p-3 rounded-xl">
                                {error}
                            </p>
                        )}
                        <Input
                            placeholder="Admin Identity"
                            value={adminName}
                            onChange={(e) => setAdminName(e.target.value)}
                            className="bg-white/5 h-12 rounded-xl text-center"
                        />
                        <Input
                            type="password"
                            placeholder="Secret Cipher"
                            value={adminPass}
                            onChange={(e) => setAdminPass(e.target.value)}
                            className="bg-white/5 h-12 rounded-xl text-center"
                        />
                        <AnimatedButton type="submit" className="w-full h-12 rounded-xl mt-4">
                            Proceed to Console
                        </AnimatedButton>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Return to Safety
                        </Link>
                    </div>
                </AuthCard>
            </main>
        );
    }

    return (
        <main className="min-h-screen p-8 lg:p-12 relative overflow-hidden">
            <DynamicBackground colors={[]} />

            <div className="max-w-7xl mx-auto z-10 relative">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                            <ShieldCheck className="w-3 h-3" />
                            Administrative Core
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter">Command Center</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-right">
                            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Operator</p>
                            <p className="font-bold">{ADMIN_CREDENTIALS.name}</p>
                        </div>
                        <AnimatedButton onClick={() => setIsAuthenticated(false)} variant="outline" className="h-14 px-6 rounded-2xl border-white/10 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20">
                            Terminate Session
                        </AnimatedButton>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Analyses', value: '1,284', icon: Activity, color: 'text-primary' },
                        { label: 'Active Sessions', value: '42', icon: Users, color: 'text-emerald-500' },
                        { label: 'Storage Used', value: '84.2 GB', icon: History, color: 'text-purple-500' },
                        { label: 'System Health', value: '99.9%', icon: Zap, color: 'text-yellow-500' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] group hover:bg-white/10 transition-all">
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color} mb-4 w-fit group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-3xl font-black">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden">
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-xl font-bold flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-primary" />
                                    Recent Scrape Activity
                                </h3>
                                <AnimatedButton variant="outline" className="h-10 px-4 rounded-xl text-xs">View All Logs</AnimatedButton>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-[10px] uppercase tracking-widest font-black text-muted-foreground/40">
                                        <tr>
                                            <th className="px-8 py-4">Status</th>
                                            <th className="px-8 py-4">Target URL</th>
                                            <th className="px-8 py-4">Assets</th>
                                            <th className="px-8 py-4 text-right">Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {[1, 2, 3, 4, 5].map((_, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors cursor-pointer group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                        <span className="text-xs font-bold text-emerald-500">Success</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <p className="text-sm font-bold truncate max-w-[300px]">https://framer.com/showcase</p>
                                                    <p className="text-[10px] text-muted-foreground/40 uppercase font-black">ID: #8372-{i}</p>
                                                </td>
                                                <td className="px-8 py-6 text-sm font-bold">142 Items</td>
                                                <td className="px-8 py-6 text-right text-xs text-muted-foreground font-medium">2m ago</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 backdrop-blur-3xl border border-primary/20 rounded-[2.5rem] p-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <Settings className="w-5 h-5 text-primary" />
                                System Controls
                            </h3>
                            <div className="space-y-4">
                                {[
                                    'Analytics Tracking',
                                    'Public Registration',
                                    'API Rate Limiting',
                                    'Automatic Backups'
                                ].map((setting, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                                        <span className="text-sm font-bold group-hover:text-primary transition-colors">{setting}</span>
                                        <div className="w-10 h-6 bg-primary/20 rounded-full relative p-1">
                                            <div className="w-4 h-4 bg-primary rounded-full absolute right-1" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8">
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-6">Database Health</h4>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-3 uppercase tracking-widest">
                                        <span>Connections</span>
                                        <span className="text-primary">82%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[82%]" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-3 uppercase tracking-widest">
                                        <span>IOPS Utilization</span>
                                        <span className="text-purple-500">45%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 w-[45%]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
