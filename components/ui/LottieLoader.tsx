'use client';

import React from 'react';
import Lottie from 'lottie-react';

interface LottieLoaderProps {
    animationData: any;
    width?: number | string;
    height?: number | string;
    loop?: boolean;
}

export function LottieLoader({ animationData, width = 200, height = 200, loop = true }: LottieLoaderProps) {
    return (
        <div style={{ width, height }} className="flex items-center justify-center">
            <Lottie animationData={animationData} loop={loop} />
        </div>
    );
}

// Example: Shimmer loader placeholder if Lottie is not available
export function ShimmerLoader() {
    return (
        <div className="w-full h-full min-h-[200px] relative overflow-hidden bg-white/5 rounded-3xl border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer-slide" />
        </div>
    );
}
