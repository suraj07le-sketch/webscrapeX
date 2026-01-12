'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import React, { useRef } from 'react';

interface AnimatedCardProps {
    children: React.ReactNode;
    className?: string;
    tilt?: boolean;
    variant?: 'default' | 'neon' | 'glass';
}

export function AnimatedCard({ children, className, tilt = true, variant = 'default' }: AnimatedCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!tilt || !ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const variants = {
        default: 'border-white/10 bg-white/5 hover:bg-white/[0.08]',
        neon: 'border-primary/20 bg-primary/5 hover:border-primary/50 shadow-[0_0_30px_rgba(var(--primary),0.1)]',
        glass: 'border-white/20 bg-white/10 backdrop-blur-2xl hover:bg-white/20',
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            whileHover={{ y: -12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={cn(
                'relative group overflow-hidden rounded-[2.5rem] border p-8 transition-all duration-500',
                variants[variant],
                className
            )}
        >
            {/* Background Expansion Bubble */}
            <motion.div
                className="absolute bg-primary/10 rounded-full -z-0 pointer-events-none"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 2, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'circOut' }}
                style={{
                    width: '400px',
                    height: '400px',
                    left: '50%',
                    top: '50%',
                    x: '-50%',
                    y: '-50%',
                }}
            />

            {/* Gradient Glow Reveal */}
            <div className={cn(
                "absolute -inset-1 bg-gradient-to-r rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-700",
                variant === 'neon' ? "from-primary/40 to-purple-600/40" : "from-white/10 to-white/5"
            )} />

            <div className="relative z-10" style={{ transform: 'translateZ(60px)' }}>
                {children}
            </div>

            {/* Light Sweep (Optional subtle shine) */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-150%] animate-sweep" />
            </div>
        </motion.div>
    );
}
