'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';

interface HoverGlowProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
    intensity?: 'soft' | 'medium' | 'high';
}

export function HoverGlow({
    children,
    className,
    glowColor = 'hsl(var(--primary))',
    intensity = 'medium'
}: HoverGlowProps) {
    const blurMap = {
        soft: 'blur-xl',
        medium: 'blur-2xl',
        high: 'blur-3xl'
    };

    return (
        <div className={cn('relative group cursor-pointer', className)}>
            <div
                className={cn(
                    'absolute -inset-2 opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full animate-pulse-glow -z-10',
                    blurMap[intensity]
                )}
                style={{ backgroundColor: glowColor }}
            />
            {children}
        </div>
    );
}

interface GradientFillProps {
    children: React.ReactNode;
    className?: string;
    from?: string;
    to?: string;
    direction?: 'r' | 'l' | 't' | 'b' | 'tr' | 'br';
}

export function GradientFill({
    children,
    className,
    from = 'primary',
    to = 'purple-600',
    direction = 'r'
}: GradientFillProps) {
    return (
        <div className={cn('relative group overflow-hidden rounded-xl', className)}>
            <motion.div
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.4, ease: 'circOut' }}
                className={cn(
                    'absolute inset-0 z-0 bg-gradient-to-' + direction,
                    `from-${from} to-${to}`
                )}
            />
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

interface NavHoverProps {
    children: React.ReactNode;
    className?: string;
    active?: boolean;
}

export function NavHover({ children, className, active }: NavHoverProps) {
    return (
        <div className={cn('relative px-4 py-2 group cursor-pointer', className)}>
            <motion.div
                className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 -z-10"
                layoutId="nav-bg"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            />
            {active && (
                <motion.div
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full"
                    layoutId="nav-underline"
                />
            )}
            <span className={cn(
                "relative transition-colors duration-300 font-medium text-sm",
                active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}>
                {children}
            </span>
        </div>
    );
}

interface IconGlowProps {
    icon: React.ReactNode;
    className?: string;
    color?: 'primary' | 'purple' | 'emerald';
}

export function IconGlow({ icon, className, color = 'primary' }: IconGlowProps) {
    const colorMap = {
        primary: 'bg-primary',
        purple: 'bg-purple-600',
        emerald: 'bg-emerald-500'
    };

    return (
        <motion.div
            whileHover={{ scale: 1.15 }}
            className={cn(
                'relative p-3 rounded-xl flex items-center justify-center transition-all group',
                className
            )}
        >
            <div className={cn(
                'absolute inset-0 blur-lg opacity-0 group-hover:opacity-30 transition-opacity rounded-full',
                colorMap[color]
            )} />
            <div className="relative z-10 group-hover:text-white transition-colors">
                {icon}
            </div>
        </motion.div>
    );
}

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

export function GlassInput({ icon, className, ...props }: GlassInputProps) {
    return (
        <div className="relative group w-full">
            {icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-300 z-10">
                    {icon}
                </div>
            )}
            <input
                className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 backdrop-blur-xl transition-all duration-500",
                    "focus:bg-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10",
                    "outline-none placeholder:text-muted-foreground/30 text-sm",
                    icon && "pl-12",
                    className
                )}
                {...props}
            />
            <div className="absolute -inset-0.5 bg-primary/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 -z-10" />
        </div>
    );
}
