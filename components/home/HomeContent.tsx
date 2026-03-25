'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Zap, Code2, Palette, FileImage, LayoutGrid, Clock, ArrowRight, Menu, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';
import { DynamicBackground } from '@/components/ui/DynamicBackground';
import { HistoryCard } from '@/components/HistoryCard';
import { ScrollFadeIn, TextReveal, MotionDiv, ParallaxWrapper } from '@/components/ui/MotionWrappers';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { useAuth } from '@/hooks/useAuth';
import { IconGlow } from '@/components/ui/PremiumAnimations';
import { ScrapeMode } from '@/lib/scraper-types';
import { ScrapeModeSelector } from './ScrapeModeSelector';
import { useResponsive, useTouchDevice, useReducedMotion } from '@/hooks/useResponsive';
import { MobileNav, MobileButton, MobileInput } from '@/components/MobileNav';
import { useFastFetch, usePrefetch } from '@/hooks/useFastFetch';
import Link from 'next/link';

// Lazy load heavy components
const AnalyticsDashboard = lazy(() => import('@/components/AnalyticsDashboard').then(mod => ({ default: mod.AnalyticsDashboard })));

export function HomeContent() {
    const { user, session } = useAuth();
    const searchParams = useSearchParams();
    const [url, setUrl] = useState(searchParams.get('scrape') || '');
    const [mode, setMode] = useState<ScrapeMode>('full');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    // Responsive hooks
    const { isMobile, isTablet, isDesktop } = useResponsive();
    const isTouch = useTouchDevice();
    const prefersReducedMotion = useReducedMotion();
    
    // Fast data fetching with prefetching
    const { prefetchUrl } = usePrefetch();

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) {
                setHistory([]);
                return;
            }

            // Lazy init supabase client only when needed
            const { createBrowserClient } = await import('@supabase/auth-helpers-nextjs');
            const client = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const { data, error } = await client
                .from('websites')
                .select('id, url, created_at, metadata (title, favicon, color_palette)')
                .eq('status', 'completed')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(isMobile ? 6 : 9);

            if (!error && data) {
                setHistory(data.map((item: any) => ({
                    ...item,
                    metadata: Array.isArray(item.metadata) ? item.metadata[0] : item.metadata
                })));
            }
        };

        fetchHistory();
    }, [user, isMobile]);

    const handleScrape = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        if (!user) {
            const returnUrl = encodeURIComponent(`/?scrape=${encodeURIComponent(url)}`);
            router.push(`/login?returnTo=${returnUrl}`);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('Sending capture request to API v2...');
            
            // Prefetch the result page for faster navigation
            if (url) {
                prefetchUrl(`/api/scrape/content?url=${encodeURIComponent(url)}`);
            }
            
            const res = await fetch('/api/v2/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ url, mode }),
                credentials: 'include', // Force sending cookies
            });

            if (res.status === 401) {
                router.push('/login');
                return;
            }

            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await res.text();
                console.error('Non-JSON response:', text);
                throw new Error(`Server returned non-JSON response (${res.status}). It might be a redirect or error page.`);
            }

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.details || data.error || 'Failed to start scraping');
            }

            router.push(`/result/${data.id}`);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen relative overflow-x-hidden flex flex-col items-center pt-28 md:pt-32 pb-12 px-4 md:px-8 scroll-smooth">
            <DynamicBackground colors={[]} />
            
            {/* Mobile Navigation Button */}
            {isMobile && (
                <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="fixed top-4 right-4 z-40 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md"
                    aria-label="Open menu"
                >
                    <Menu className="w-6 h-6" />
                </button>
            )}
            
            {/* Mobile Navigation Menu */}
            <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

            {/* Hero Section */}
            <section className="w-full max-w-7xl z-10 flex flex-col items-center mb-20 md:mb-24">
                <ScrollFadeIn direction="up">
                    <div className="text-center mb-10 md:mb-12 flex flex-col items-center w-full max-w-5xl relative">
                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 blur-[120px] rounded-full -z-10 animate-pulse" />

                        <MotionDiv
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 md:mb-8 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80"
                        >
                            <Zap className="w-3 h-3 fill-current" />
                            New: Social & Content Intelligence
                        </MotionDiv>

                        <h1 className="text-4xl md:text-6xl lg:text-[7rem] font-black tracking-tighter mb-6 md:mb-8 leading-[0.9] md:leading-[0.85] bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/40 py-2">
                            <TextReveal text="Design" />
                            <TextReveal text="Intelligence." />
                        </h1>

                        <ScrollFadeIn delay={0.2}>
                            <p className="text-base md:text-xl text-muted-foreground/60 max-w-xl md:max-w-2xl mx-auto leading-relaxed font-medium">
                                Deconstruct any website's design system in seconds. <br className="hidden md:block" />
                                Colors, fonts, assets, and code — extracted and analyzed.
                            </p>
                        </ScrollFadeIn>
                    </div>
                </ScrollFadeIn>

                <ScrollFadeIn delay={0.4} className="w-full max-w-3xl mb-20 md:mb-24">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                        <div className="relative backdrop-blur-3xl bg-background/60 border border-white/10 p-3 md:p-2 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl">
                            <form onSubmit={handleScrape} className="flex flex-col md:flex-row items-stretch md:items-center bg-background/40 rounded-[1rem] md:rounded-[2rem] border border-white/5 p-3 md:p-2 gap-3 md:gap-0">
                                <div className="hidden md:block">
                                    <ScrapeModeSelector mode={mode} setMode={setMode} />
                                </div>
                                <div className="hidden md:block h-8 w-px bg-white/10 mx-2" />

                                <div className="flex items-center gap-2 px-2 md:hidden">
                                    <ScrapeModeSelector mode={mode} setMode={setMode} />
                                </div>

                                <div className="flex-1 relative flex items-center">
                                    <div className="absolute left-4 text-muted-foreground/40 pointer-events-none">
                                        <Search className="w-5 h-5" />
                                    </div>
                                    {isMobile ? (
                                        <MobileInput
                                            type="url"
                                            placeholder="https://example.com"
                                            value={url}
                                            style={{ paddingLeft: '3rem' }}
                                            onChange={(e) => setUrl(e.target.value)}
                                            className="pl-12 pr-4"
                                            required
                                        />
                                    ) : (
                                        <Input
                                            type="url"
                                            placeholder="https://example.com"
                                            value={url}
                                            style={{ paddingLeft: '3rem' }}
                                            onChange={(e) => setUrl(e.target.value)}
                                            className="w-full pl-12 pr-4 h-14 text-lg font-medium bg-transparent border-none focus-visible:ring-0 placeholder:text-muted-foreground/30"
                                            required
                                        />
                                    )}
                                </div>

                                <div className="mt-2 md:mt-0 md:ml-2">
                                    {isMobile ? (
                                        <MobileButton
                                            type="submit"
                                            onClick={() => {}}
                                            className="w-full h-12 px-6 font-bold bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <span>Capture</span>
                                                    <ArrowRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </MobileButton>
                                    ) : (
                                        <AnimatedButton
                                            type="submit"
                                            variant="sweep"
                                            className="h-14 px-8 text-lg shadow-lg shadow-primary/20 rounded-[1.5rem]"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span>Capture</span>
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            )}
                                        </AnimatedButton>
                                    )}
                                </div>
                            </form>
                        </div>
                        {error && <p className="mt-3 text-destructive text-sm font-medium text-center md:text-left">{error}</p>}
                    </div>
                </ScrollFadeIn>
            </section>

            {/* Feature Section */}
            <section id="features" className="w-full max-w-7xl z-10 px-4 mb-32">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    <ScrollFadeIn delay={0.1}>
                        <AnimatedCard variant="glass" className="p-4 md:p-6">
                            <div className="mb-4 md:mb-6">
                                <IconGlow icon={<Code2 className="w-6 h-6 md:w-8 md:h-8 text-primary" />} color="primary" />
                            </div>
                            <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 tracking-tight">Full Stack Analysis</h3>
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Deep detection of frameworks, libraries, and sub-systems with version mapping.</p>
                        </AnimatedCard>
                    </ScrollFadeIn>

                    <ScrollFadeIn delay={0.2}>
                        <AnimatedCard variant="glass" className="p-4 md:p-6">
                            <div className="mb-4 md:mb-6">
                                <IconGlow icon={<Palette className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />} color="purple" />
                            </div>
                            <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 tracking-tight">Design DNA</h3>
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Automatic generation of brand guidelines including color accessibility and type scales.</p>
                        </AnimatedCard>
                    </ScrollFadeIn>

                    <ScrollFadeIn delay={0.3}>
                        <AnimatedCard variant="glass" className="p-4 md:p-6">
                            <div className="mb-4 md:mb-6">
                                <IconGlow icon={<FileImage className="w-6 h-6 md:w-8 md:h-8 text-emerald-500" />} color="emerald" />
                            </div>
                            <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 tracking-tight">Asset Vault</h3>
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Centralized repository for all high-res images, icons, and vector assets extracted locally.</p>
                        </AnimatedCard>
                    </ScrollFadeIn>

                    <ScrollFadeIn delay={0.4}>
                        <AnimatedCard variant="glass" className="p-4 md:p-6">
                            <div className="mb-4 md:mb-6">
                                <IconGlow icon={<Zap className="w-6 h-6 md:w-8 md:h-8 text-pink-500" />} color="purple" />
                            </div>
                            <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 tracking-tight">Social & Content</h3>
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Extracts Open Graph tags, Twitter cards, and clean article content for easy consumption.</p>
                        </AnimatedCard>
                    </ScrollFadeIn>
                </div>
            </section>

            {/* Parallax Image Section (Visual Polish) */}
            <section className="w-full max-w-6xl mb-20 md:mb-32 relative overflow-hidden rounded-[1.5rem] md:rounded-[4rem] group">
                <ParallaxWrapper offset={isMobile ? 10 : 80}>
                    <div className="h-[250px] md:h-[600px] w-full bg-gradient-to-br from-primary/20 via-background to-purple-500/20 relative">
                        <div className="absolute inset-0 flex items-center justify-center p-4 md:p-20">
                            <div className="text-center">
                                <h2 className="text-2xl md:text-6xl font-black mb-3 md:mb-6">Built for speed.</h2>
                                <p className="text-xs md:text-xl text-muted-foreground max-w-lg mx-auto px-4">Experience the fastest design extraction engine ever built.</p>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-[150px] md:w-[400px] h-[150px] md:h-[400px] bg-primary/20 blur-[60px] md:blur-[150px] -z-10" />
                        <div className="absolute bottom-0 left-0 w-[150px] md:w-[400px] h-[150px] md:h-[400px] bg-purple-500/20 blur-[60px] md:blur-[150px] -z-10" />
                    </div>
                </ParallaxWrapper>
            </section>

            {/* Visual Builder Teaser */}
            <section className="w-full max-w-7xl z-10 px-4 mb-32">
                <AnimatedCard variant="glass" className="p-0 overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-8 md:p-12 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                                <Sparkles className="w-3 h-3" /> Coming Soon
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                                Visual Scraper <br/>
                                <span className="text-primary">Builder</span>
                            </h2>
                            <p className="text-xl text-muted-foreground/60 leading-relaxed">
                                Build complex scrapers without writing a single line of code. Point, click, and extract data from any dynamic element on any website.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <div className="flex items-center gap-2 text-sm font-bold">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>Point & Click</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>Infinite Scroll</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>Auto-Pagination</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative bg-white/5 border-t lg:border-t-0 lg:border-l border-white/5 flex items-center justify-center p-4 md:p-8 overflow-hidden">
                            <div className="absolute inset-0 bg-grid-white/5" />
                            <motion.div 
                                animate={{ 
                                    y: [0, -10, 0],
                                    rotateX: [20, 25, 20],
                                    rotateY: [-10, -5, -10]
                                }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                style={{ perspective: 1000 }}
                                className="w-full max-w-sm aspect-video rounded-2xl bg-[#0a0a0a] border border-white/20 shadow-2xl relative"
                            >
                                <div className="absolute top-0 left-0 right-0 h-6 border-b border-white/10 flex items-center gap-1.5 px-3">
                                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                    <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                                </div>
                                <div className="mt-8 px-4 space-y-3">
                                    <div className="h-4 w-3/4 bg-white/5 rounded" />
                                    <div className="h-24 w-full bg-white/10 rounded-xl relative border border-primary/40 flex items-center justify-center">
                                        <div className="absolute -top-3 -left-3 bg-primary text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Selected</div>
                                        <div className="w-full h-full bg-primary/20 animate-pulse rounded-xl" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="h-4 w-full bg-white/5 rounded" />
                                        <div className="h-4 w-full bg-white/5 rounded" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </AnimatedCard>
            </section>

            {/* Analytics Dashboard - Lazy Loaded */}
            {history.length > 3 && (
                <Suspense fallback={
                    <div className="w-full max-w-7xl z-10 px-4 mb-32">
                        <div className="h-[400px] rounded-3xl bg-white/5 animate-pulse" />
                    </div>
                }>
                    <AnalyticsDashboard history={history} />
                </Suspense>
            )}

            {/* History Collection Section */}
            {
                history.length > 0 && (
                    <section className="w-full max-w-7xl z-10 px-4 space-y-6 md:space-y-12 mb-16 md:mb-32">
                        <ScrollFadeIn direction="up">
                            <div className="flex flex-col gap-4 md:gap-6 border-b border-white/10 pb-6 md:pb-12">
                                <div className="space-y-2 md:space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                                        Personal Library
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Your Collections</h2>
                                    <p className="text-base md:text-xl text-muted-foreground/60 max-w-xl">
                                        A high-fidelity archive of all design systems you've previously analyzed.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground/40">
                                    <div className="flex items-center gap-2">
                                        <LayoutGrid className="w-4 h-4" />
                                        <span>{history.length} ITEMS</span>
                                    </div>
                                    <div className="w-px h-4 bg-white/10 hidden sm:block" />
                                    <div className="flex items-center gap-2 hidden sm:flex">
                                        <Clock className="w-4 h-4" />
                                        <span>SYNCED</span>
                                    </div>
                                </div>
                            </div>
                        </ScrollFadeIn>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 pt-4">
                            {history.map((item, idx) => (
                                <ScrollFadeIn key={item.id} delay={idx * 0.05}>
                                    <HistoryCard item={item} />
                                </ScrollFadeIn>
                            ))}
                        </div>
                    </section>
                )
            }
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SoftwareApplication',
                        name: 'WebScrapeX',
                        applicationCategory: 'DeveloperApplication',
                        operatingSystem: 'Any',
                        offers: {
                            '@type': 'Offer',
                            price: '0',
                            priceCurrency: 'USD',
                        },
                        description: 'Extract assets, metadata, colors, technologies, and design systems from any website.',
                        aggregateRating: {
                            '@type': 'AggregateRating',
                            ratingValue: '4.8',
                            ratingCount: '1024',
                        },
                    }),
                }}
            />
        </main >
    );
}
