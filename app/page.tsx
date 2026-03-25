'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import HomeContent with SSR disabled to prevent server hanging
const HomeContent = dynamic(() => import('@/components/home/HomeContent').then(mod => mod.HomeContent), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <div className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          Loading Experience...
        </div>
      </div>
    </div>
  )
});

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
            Loading Experience...
          </div>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
