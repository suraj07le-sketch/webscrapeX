'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Home,
    History,
    Settings,
    Search,
    ChevronRight,
    Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function SidebarContent() {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Home', icon: Home, href: pathname.includes('/result/') ? pathname : '/' },
        { name: 'Collections', icon: History, href: '/collections' },
        { name: 'API Access', icon: Zap, href: '/api-access' },
        { name: 'Settings', icon: Settings, href: '/settings' },
    ];

    return (
        <div className="flex flex-col h-full bg-background/40 backdrop-blur-xl md:bg-transparent">
            {/* Logo Section */}
            <div className="p-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                        <Zap className="w-6 h-6 text-white fill-current" />
                    </div>
                    <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        WebScrapeX
                    </span>
                </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="overflow-y-auto px-4 space-y-1 py-2 flex-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.name === 'Home' && pathname.includes('/result/'));
                    return (
                        <Link key={item.name} href={item.href}>
                            <div className={cn(
                                "flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group relative",
                                isActive
                                    ? "bg-primary/10 text-primary shadow-sm"
                                    : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                            )}>
                                <div className="flex items-center gap-3">
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                    <span className="font-medium text-sm">{item.name}</span>
                                </div>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                                    />
                                )}
                                <ChevronRight className={cn(
                                    "w-4 h-4 opacity-0 transition-opacity group-hover:opacity-100",
                                    isActive && "opacity-100"
                                )} />
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Section */}
            <div className="p-4 border-t border-white/5">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-2">Pro Plan</p>
                    <h4 className="text-xs font-bold mb-1">Unlimited Scrapes</h4>
                    <p className="text-[10px] text-muted-foreground mb-3">You've saved 2.4GB of data this month.</p>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[65%]" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function Sidebar() {
    return (
        <aside className="hidden md:block w-64 bg-background/40 backdrop-blur-xl border-r border-white/10 fixed h-screen z-50 transition-all duration-300">
            <SidebarContent />
        </aside>
    );
}
