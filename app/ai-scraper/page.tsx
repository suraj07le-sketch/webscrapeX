'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { DynamicBackground } from '@/components/ui/DynamicBackground';
import { Loader2, Sparkles, Wand2, ArrowLeft, Terminal, FileJson, Copy, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ScrollFadeIn, MotionDiv } from '@/components/ui/MotionWrappers';
import { useAuth } from '@/hooks/useAuth';
import ReactSyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export default function AIScraperPage() {
  const { session } = useAuth();
  const [url, setUrl] = useState('');
  const [prompt, setPrompt] = useState('Extract all product names and prices from this page.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleAIScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !prompt) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/v2/scrape/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ url, prompt })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI Extraction failed');

      setResult(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen relative overflow-x-hidden flex flex-col items-center pt-20 pb-12 px-4">
      <DynamicBackground colors={['#7c3aed', '#db2777']} />

      <section className="w-full max-w-5xl z-10 flex flex-col">
        <ScrollFadeIn>
          <button 
            onClick={() => router.back()}
            className="group mb-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Back to Dashboard</span>
          </button>

          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 font-bold uppercase tracking-[0.2em] text-[10px] text-primary">
              <Sparkles className="w-3 h-3" />
              Next-Gen AI Extraction
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9]">
              AI Scraper.
            </h1>
            <p className="text-xl text-muted-foreground/60 max-w-2xl leading-relaxed">
              Describe what you want to extract in plain English. No more selectors, no more CSS. Just pure structured data.
            </p>
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn delay={0.2}>
          <div className="relative group mb-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000" />
            <div className="relative backdrop-blur-3xl bg-background/60 border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-2xl">
              <form onSubmit={handleAIScrape} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40 ml-4">Target URL</label>
                  <Input 
                    type="url"
                    placeholder="https://example.com/products"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="h-14 md:h-16 rounded-2xl bg-white/5 border-white/10 text-lg selection:bg-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40 ml-4">What should I extract?</label>
                  <textarea 
                    placeholder="Extract all product names, their current prices, and stock availability..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    required
                    className="w-full min-h-[120px] p-4 rounded-2xl bg-white/5 border border-white/10 text-lg selection:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                <AnimatedButton 
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
                  variant="neon"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Processing with AI...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Wand2 className="w-6 h-6" />
                      <span>Generate Extraction</span>
                    </div>
                  )}
                </AnimatedButton>
              </form>
            </div>
            {error && <p className="mt-4 text-destructive text-sm font-bold text-center">{error}</p>}
          </div>
        </ScrollFadeIn>

        {result && (
          <ScrollFadeIn delay={0.4}>
            <div className="space-y-4">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/40">
                  <Terminal className="w-4 h-4" />
                  <span>Output JSON</span>
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              
              <div className="rounded-3xl border border-white/10 overflow-hidden bg-[#0a0a0a]">
                <ReactSyntaxHighlighter 
                  language="json" 
                  style={atomOneDark}
                  customStyle={{
                    padding: '24px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    background: 'transparent'
                  }}
                >
                  {JSON.stringify(result, null, 2)}
                </ReactSyntaxHighlighter>
              </div>
            </div>
          </ScrollFadeIn>
        )}
      </section>
    </main>
  );
}
