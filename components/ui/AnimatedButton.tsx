'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'neon' | 'glass' | 'sweep' | 'fill';
    children: React.ReactNode;
}

export function AnimatedButton({ children, className, variant = 'primary', ...props }: AnimatedButtonProps) {
    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();

        setRipples((prev) => [...prev, { x, y, id }]);
        props.onClick?.(e);

        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 600);
    };

    const variants = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        neon: 'bg-primary text-white shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.6)] border-none',
        glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
        sweep: 'bg-primary text-white overflow-hidden',
        fill: 'bg-transparent border-2 border-primary text-primary hover:text-white transition-colors duration-500',
    };

    const { onClick, disabled, type, ...rest } = props;

    return (
        <motion.button
            whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            type={type}
            disabled={disabled}
            className={cn(
                'relative overflow-hidden inline-flex items-center justify-center rounded-2xl px-8 py-4 text-sm font-black tracking-wider uppercase transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
                variants[variant],
                className
            )}
            onClick={handleClick}
        >
            {/* Background Fill Animation */}
            {variant === 'fill' && (
                <motion.div
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '0%' }}
                    transition={{ duration: 0.4, ease: 'circOut' }}
                    className="absolute inset-0 bg-primary -z-0"
                />
            )}

            {/* Sweep Effect */}
            {variant === 'sweep' && (
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-[25deg] translate-x-[-150%] group-hover:animate-sweep pointer-events-none" />
                </div>
            )}

            <span className="relative z-10">{children}</span>

            {/* Neon Glow Pulse */}
            {variant === 'neon' && (
                <div className="absolute -inset-1 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
            )}

            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-20"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: '100px',
                        height: '100px',
                    }}
                />
            ))}
        </motion.button>
    );
}
