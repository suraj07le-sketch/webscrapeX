'use client';

import { useEffect, useState, useMemo } from 'react';

interface DynamicBackgroundProps {
    colors: string[];
}

export function DynamicBackground({ colors }: DynamicBackgroundProps) {
    const [palette, setPalette] = useState<string[]>(['#1e293b', '#0f172a', '#020617']);

    useEffect(() => {
        if (colors && colors.length > 0) {
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

    // Static gradient instead of animated blobs for performance
    const gradientStyle = useMemo(() => {
        if (palette.length < 2) return {};
        return {
            background: `radial-gradient(ellipse at 20% 50%, ${palette[0]}33 0%, transparent 50%),
                         radial-gradient(ellipse at 80% 50%, ${palette[1] || palette[0]}22 0%, transparent 50%),
                         radial-gradient(ellipse at 50% 80%, ${palette[2] || palette[0]}11 0%, transparent 40%)`,
        };
    }, [palette]);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-background" />
            <div className="absolute inset-0 opacity-30" style={gradientStyle} />
        </div>
    );
}
