'use client';

import { useEffect, useState, useRef } from 'react';

export function MotionProvider({ children }: { children: React.ReactNode }) {
    const [isReady, setIsReady] = useState(false);
    const initializedRef = useRef(false);

    useEffect(() => {
        // Defer animation library initialization until after initial paint
        const initAnimations = async () => {
            if (initializedRef.current) return;
            initializedRef.current = true;
            
            // Wait for next frame to ensure page is rendered
            await new Promise(resolve => requestAnimationFrame(resolve));
            
            const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
                import('@studio-freight/lenis'),
                import('gsap'),
                import('gsap/dist/ScrollTrigger')
            ]);
            
            gsap.registerPlugin(ScrollTrigger);
            
            // Initialize Lenis with optimized settings
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1,
                infinite: false,
            });

            ScrollTrigger.scrollerProxy(document.body, {
                scrollTop(value) {
                    if (arguments.length) {
                        lenis.scrollTo(value as number, { immediate: true });
                    }
                    return lenis.scroll;
                },
                getBoundingClientRect() {
                    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
                },
            });

            lenis.on('scroll', ScrollTrigger.update);

            function update(time: number) {
                lenis.raf(time * 1000);
            }

            gsap.ticker.add(update);
            gsap.ticker.lagSmoothing(0);
            
            setIsReady(true);

            return () => {
                lenis.destroy();
                gsap.ticker.remove(update);
                ScrollTrigger.clearScrollMemory();
            };
        };

        // Start animation init after a short delay to not block initial render
        const timeoutId = setTimeout(initAnimations, 100);
        
        return () => clearTimeout(timeoutId);
    }, []);

    return <>{children}</>;
}
