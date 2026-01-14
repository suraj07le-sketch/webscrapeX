'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { ThemeToggle } from "@/components/ThemeToggle";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { SidebarContent } from "./Sidebar";
import { Menu } from "lucide-react";


import { Command, Search, Zap, LogIn, UserPlus, LogOut, Shield, ChevronDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, isAdmin, signOut } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const isResultPage = pathname.includes('/result/') || pathname.includes('/api-access') || pathname.includes('/settings') || pathname.includes('/collections') || pathname.includes('/docs');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isResultPage) return null;

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={cn(
                'fixed top-0 inset-x-0 z-[100] transition-all duration-300 border-b border-transparent',
                isScrolled ? 'bg-background/80 backdrop-blur-md border-white/10 py-4' : 'bg-transparent py-6'
            )}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Trigger */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <Menu className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 border-r border-white/10 w-[80%] max-w-[300px] bg-background">
                                <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                                <SheetDescription className="sr-only">
                                    Navigation links for WebScrapeX mobile interface.
                                </SheetDescription>
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                        <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-xl font-black tracking-tighter">WEBSCRAPEX</span>
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="/collections" className="hover:text-foreground transition-colors">Collections</Link>
                    <Link href="/api-access" className="hover:text-foreground transition-colors">API</Link>
                    <Link href="/settings" className="hover:text-foreground transition-colors">Settings</Link>
                    <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                    <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
                    {isAdmin && (
                        <Link href="/admin" className="text-primary font-bold flex items-center gap-1.5 hover:opacity-80 transition-opacity ml-2">
                            <Shield className="w-4 h-4" />
                            Admin
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-muted-foreground">
                        <Command className="w-3 h-3" />
                        <span>K</span>
                    </div>

                    {!loading && (
                        <>
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-3 pl-4 pr-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                            {user.email?.[0].toUpperCase()}
                                        </div>
                                        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", showUserMenu && "rotate-180")} />
                                    </button>

                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-3 w-56 bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 z-[110]">
                                            <div className="px-4 py-3 border-b border-white/5 mb-2">
                                                <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Logged in as</p>
                                                <p className="text-xs font-bold truncate">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={async () => {
                                                    await signOut();
                                                    setShowUserMenu(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link href="/login">
                                        <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                                            <LogIn className="w-4 h-4" />
                                            Login
                                        </button>
                                    </Link>
                                    <Link href="/signup">
                                        <button className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                                            <UserPlus className="w-4 h-4" />
                                            <span className="hidden sm:inline">Sign Up</span>
                                            <span className="sm:hidden">Join</span>
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </>
                    )}

                    <ThemeToggle />
                </div>
            </div>

            {/* Scroll Progress Bar */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary origin-left"
                style={{ scaleX }}
            />
        </motion.nav>
    );
}
