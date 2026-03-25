"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DynamicBackground } from "@/components/ui/DynamicBackground";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy, Key, Server, Terminal, Zap, Globe, Bell, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function ApiAccessPage() {
    const [apiKey, setApiKey] = useState<string>("sk_live_51x...");
    const [revealed, setRevealed] = useState(false);
    const [copied, setCopied] = useState(false);
    const [host, setHost] = useState<string>('https://webscrapex.com');

    const generateKey = () => {
        // Mock generation - in production this would call your API
        const newKey = "sk_live_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        setApiKey(newKey);
        setRevealed(true);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setHost(window.location.origin);
        }
    }, []);

    return (
        <div className="min-h-screen bg-transparent font-sans relative flex items-stretch overflow-x-hidden text-foreground">
            <DynamicBackground colors={[]} />
            <Sidebar />

            <div className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto space-y-8"
                >
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                            <Zap className="w-3 h-3" />
                            Developer API
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">API Access</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Integrate WebScrapeX directly into your workflows. Use our REST API to capture, analyze, and extract design systems on demand.
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {/* API Key Management */}
                        <Card className="border-white/10 bg-card/40 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Key className="w-5 h-5 text-yellow-500" />
                                    Your API Key
                                </CardTitle>
                                <CardDescription>
                                    Use this key to authenticate your requests. Keep it secret.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <Input
                                            value={revealed ? apiKey : "••••••••••••••••••••••••••••••••"}
                                            readOnly
                                            className="font-mono bg-white/5 border-white/10 pr-10"
                                        />
                                    </div>
                                    <Button onClick={generateKey} variant="outline" className="border-white/10 hover:bg-white/5">
                                        {revealed ? "Regenerate" : "Reveal Key"}
                                    </Button>
                                    <Button
                                        onClick={() => copyToClipboard(apiKey)}
                                        className="gap-2 bg-primary hover:bg-primary/90 text-white"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copied ? "Copied" : "Copy"}
                                    </Button>
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                    <Server className="w-3 h-3" />
                                    <span>Rate Limit: 100 requests / minute</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Integration Guide */}
                        {/* ... existing card ... */}

                        {/* Proxy Management (Feature 8) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-white/10 bg-card/40 backdrop-blur-md">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <Globe className="w-5 h-5 text-emerald-500" />
                                            Proxy Rotation
                                        </CardTitle>
                                        <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-tighter">Enterprise</div>
                                    </div>
                                    <CardDescription>
                                        Automatically rotate IP addresses to bypass rate limits.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-bold">Residential Proxies</div>
                                            <div className="text-[10px] text-muted-foreground">High anonymity, low detection</div>
                                        </div>
                                        <Switch disabled checked={true} />
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 opacity-50">
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-bold">Custom Proxy List</div>
                                            <div className="text-[10px] text-muted-foreground">Use your own proxy providers</div>
                                        </div>
                                        <Switch disabled />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-white/10 bg-card/40 backdrop-blur-md">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <Bell className="w-5 h-5 text-blue-500" />
                                            Global Webhooks
                                        </CardTitle>
                                        <div className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase tracking-tighter">Feature 4</div>
                                    </div>
                                    <CardDescription>
                                        Receive real-time notifications for automated jobs.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Default Endpoint</label>
                                        <div className="flex gap-2">
                                            <Input placeholder="https://api.yourdomain.com/webhooks/scrapex" className="bg-white/5 border-white/10 text-xs" />
                                            <Button size="sm" variant="outline" className="border-white/10">Save</Button>
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                                        <Info className="w-3 h-3 text-primary" />
                                        <span>Webhooks are signed using your API Key for security.</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <Card className="border-white/10 bg-card/40 backdrop-blur-md overflow-hidden">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Terminal className="w-5 h-5 text-blue-500" />
                                    Integration Guide
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Tabs defaultValue="activepieces" className="w-full">
                                    <div className="px-6 border-b border-white/10">
                                        <TabsList className="bg-transparent h-12 p-0 gap-6">
                                            <TabsTrigger value="activepieces" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0">
                                                ActivePieces
                                            </TabsTrigger>
                                            <TabsTrigger value="curl" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0">
                                                cURL
                                            </TabsTrigger>
                                            <TabsTrigger value="nodejs" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0">
                                                Node.js
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <div className="p-6 bg-black/20">
                                        <TabsContent value="activepieces" className="space-y-4 mt-0">
                                            <div className="space-y-2">
                                                <h3 className="font-semibold text-sm text-foreground/80">Configure HTTP Request Step</h3>
                                                <p className="text-sm text-muted-foreground">Select "HTTP Request" action in your ActivePieces flow.</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div className="space-y-1">
                                                    <span className="text-xs text-muted-foreground font-mono uppercase">Method</span>
                                                    <div className="p-2 rounded border border-white/10 bg-white/5 font-mono text-green-400">POST</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-xs text-muted-foreground font-mono uppercase">URL</span>
                                                    <div className="p-2 rounded border border-white/10 bg-white/5 font-mono select-all">
                                                        {host}/api/v2/scrape
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <span className="text-xs text-muted-foreground font-mono uppercase">Headers</span>
                                                <div className="rounded border border-white/10 bg-white/5 font-mono overflow-auto">
                                                    <div className="flex border-b border-white/5">
                                                        <div className="w-1/3 p-2 border-r border-white/5 text-muted-foreground">Content-Type</div>
                                                        <div className="p-2 text-foreground">application/json</div>
                                                    </div>
                                                    <div className="flex">
                                                        <div className="w-1/3 p-2 border-r border-white/5 text-muted-foreground">Authorization</div>
                                                        <div className="p-2 text-foreground">Bearer {apiKey}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <span className="text-xs text-muted-foreground font-mono uppercase">Body</span>
                                                <pre className="p-4 rounded border border-white/10 bg-black/40 font-mono text-xs text-blue-300 overflow-x-auto">
                                                    {`{
  "url": "https://example.com"
}`}
                                                </pre>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="curl" className="mt-0">
                                            <pre className="p-4 rounded-lg border border-white/10 bg-black/40 font-mono text-sm text-muted-foreground overflow-x-auto">
                                                {`curl -X POST "${host}/api/v2/scrape" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{"url": "https://example.com"}'`}
                                            </pre>
                                        </TabsContent>

                                        <TabsContent value="nodejs" className="mt-0">
                                            <pre className="p-4 rounded-lg border border-white/10 bg-black/40 font-mono text-sm text-muted-foreground overflow-x-auto">
                                                {`const response = await fetch('${host}/api/v2/scrape', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${apiKey}'
  },
  body: JSON.stringify({
    url: 'https://example.com'
  })
});

const data = await response.json();
console.log(data);`}
                                            </pre>
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
