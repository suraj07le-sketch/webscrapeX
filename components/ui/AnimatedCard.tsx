'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import React, { useRef, useCallback } from 'react';

interface AnimatedCardProps {
    children: React.ReactNode;
    className?: string;
    tilt?: boolean;
    variant?: 'default' | 'neon' | 'glass';
}

export function AnimatedCard({ children, className, tilt = true, variant = 'default' }: AnimatedCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    
    const variants = {
        default: 'border-white/10 bg-white/5 hover:bg-white/[0.08]',
        neon: 'border-primary/20 bg-primary/5 hover:border-primary/50',
        glass: 'border-white/20 bg-white/10 backdrop-blur-2xl hover:bg-white/20',
    };

    // Simplified tilt effect - only when enabled
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!tilt || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        ref.current.style.transform = `perspective(1000px) rotateX(${y * -10}deg) rotateY(${x * 10}deg)`;
    }, [tilt]);

    const handleMouseLeave = useCallback(() => {
        if (ref.current) {
            ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        }
    }, []);

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn(
                'relative group overflow-hidden rounded-[2.5rem] border p-8 transition-all duration-300 will-change-transform',
                tilt && 'hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20',
                variants[variant],
                className
            )}
        >
            {/* Gradient Glow Reveal */}
            <div className={cn(
                "absolute -inset-1 bg-gradient-to-r rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500",
                variant === 'neon' ? "from-primary/40 to-purple-600/40" : "from-white/10 to-white/5"
            )} />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
