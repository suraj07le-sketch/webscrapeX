'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * Reusable motion wrapper for DIVs
 */
export const MotionDiv = motion.div;

/**
 * Scroll fade-in animation wrapper
 */
export function ScrollFadeIn({ children, delay = 0, direction = 'up', className = "" }: { children: React.ReactNode; delay?: number; direction?: 'up' | 'down' | 'left' | 'right'; className?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

    const directions = {
        up: { y: 40 },
        down: { y: -40 },
        left: { x: 40 },
        right: { x: -40 },
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, ...directions[direction] }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * Text reveal effect
 */
export function TextReveal({ text, className = "" }: { text: string; className?: string }) {
    return (
        <div className={`overflow-hidden ${className}`}>
            <motion.span
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
                viewport={{ once: true }}
                className="inline-block"
            >
                {text}
            </motion.span>
        </div>
    );
}

/**
 * Parallax wrapper using Framer Motion
 */
export function ParallaxWrapper({ children, offset = 50 }: { children: React.ReactNode; offset?: number }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

    return (
        <motion.div ref={ref} style={{ y }}>
            {children}
        </motion.div>
    );
}

/**
 * Image reveal from clip-path
 */
export function ImageReveal({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            viewport={{ once: true }}
            className="relative overflow-hidden"
        >
            {children}
        </motion.div>
    );
}
