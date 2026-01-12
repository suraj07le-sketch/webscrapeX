'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DynamicBackgroundProps {
    colors: string[];
}

export function DynamicBackground({ colors }: DynamicBackgroundProps) {
    const [palette, setPalette] = useState<string[]>(['#1e293b', '#0f172a', '#020617']);

    useEffect(() => {
        if (colors && colors.length > 0) {
            // Pick a few dominant colors, avoiding pure black/white if possible for better gradients
            const filtered = colors.filter(c => {
                const lower = c.toLowerCase();
                return lower !== '#ffffff' && lower !== '#000000' && lower !== 'rgba(0,0,0,0)';
            });

            if (filtered.length >= 2) {
                setPalette(filtered.slice(0, 4));
            } else if (colors.length >= 2) {
                setPalette(colors.slice(0, 4));
            }
        }
    }, [colors]);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Base Background */}
            <div className="absolute inset-0 bg-background" />

            {/* Animated Blobs */}
            <div className="absolute inset-0 opacity-20 blur-[120px]">
                {palette.map((color, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            backgroundColor: color,
                            width: '40vw',
                            height: '40vw',
                            left: `${(i % 2) * 50}%`,
                            top: `${Math.floor(i / 2) * 50}%`,
                        }}
                        animate={{
                            x: [0, 50, -50, 0],
                            y: [0, -50, 50, 0],
                            scale: [1, 1.2, 0.8, 1],
                        }}
                        transition={{
                            duration: 15 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Subtle Texture/Mesh */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />
        </div>
    );
}
