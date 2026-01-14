'use client';

import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { DynamicBackground } from '@/components/ui/DynamicBackground';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Zap, Search, Download, Key, Code, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-transparent font-sans relative flex items-stretch overflow-x-hidden text-foreground">
            <DynamicBackground colors={[]} />
            <Sidebar />

            <div className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-5xl mx-auto space-y-12"
                >
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                            <Book className="w-3 h-3" />
                            Documentation
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">How to use WebScrapeX</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Master the art of design extraction using our powerful automated tools and API.
                        </p>
                    </div>

                    <Tabs defaultValue="guide" className="w-full">
                        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl w-full max-w-md grid grid-cols-2">
                            <TabsTrigger value="guide" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">User Guide</TabsTrigger>
                            <TabsTrigger value="api" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">API Access</TabsTrigger>
                        </TabsList>

                        {/* User Guide Tab */}
                        <TabsContent value="guide" className="space-y-8 mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { step: 1, title: "Input URL", icon: Search, text: "Navigate to the Home dashboard. Enter the full URL (e.g., https://example.com) into the search bar." },
                                    { step: 2, title: "Analyze", icon: Zap, text: "Click Capture. Our engine visits the site, rendering it in a headless browser to extract assets, colors, and metadata." },
                                    { step: 3, title: "Export", icon: Download, text: "On the Results page, view the design breakdown. Use the floating action button to download JSON, Color Guides, or Assets." }
                                ].map((item, i) => (
                                    <Card key={i} className="bg-card/40 backdrop-blur-md border-white/10 relative overflow-hidden group hover:border-primary/30 transition-colors duration-300">
                                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                            <item.icon className="w-32 h-32" />
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-3 text-lg">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-primary font-bold shadow-inner border border-white/5">
                                                    {item.step}
                                                </div>
                                                {item.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground leading-relaxed text-sm">{item.text}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <Card className="bg-gradient-to-r from-primary/10 via-purple-500/5 to-transparent border-primary/20 relative overflow-hidden">
                                <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                                            <Zap className="w-3 h-3" /> Pro Tip
                                        </div>
                                        <h3 className="text-xl font-bold">Never lose a scrape</h3>
                                        <p className="text-muted-foreground max-w-xl">
                                            Every analysis is automatically archived. Access your complete history, including screenshots and assets, from the Collections tab.
                                        </p>
                                    </div>
                                    <Link href="/collections">
                                        <Button className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                                            Go to Collections <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </TabsContent>

                        {/* API Access Tab */}
                        <TabsContent value="api" className="space-y-8 mt-8">
                            <Card className="bg-card/40 backdrop-blur-md border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-2xl flex items-center gap-3">
                                        <Key className="w-6 h-6 text-yellow-500" />
                                        Getting your API Key
                                    </CardTitle>
                                    <CardDescription>
                                        Programmatic access for developers.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-4">
                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex-shrink-0 flex items-center justify-center text-yellow-500 font-bold">1</div>
                                            <div>
                                                <h3 className="font-bold mb-1">Navigate to API Access</h3>
                                                <p className="text-sm text-muted-foreground">Click on the "API Access" tab in the left sidebar menu.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex-shrink-0 flex items-center justify-center text-yellow-500 font-bold">2</div>
                                            <div>
                                                <h3 className="font-bold mb-1">Reveal Key</h3>
                                                <p className="text-sm text-muted-foreground">Click the "Reveal Key" button to see your unique secret key. Treat this like a password.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex-shrink-0 flex items-center justify-center text-yellow-500 font-bold">3</div>
                                            <div>
                                                <h3 className="font-bold mb-1">Make Requests</h3>
                                                <p className="text-sm text-muted-foreground">Use the key in the <code>Authorization: Bearer</code> header for your requests. Code examples are provided on the API page.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Link href="/api-access">
                                            <Button>Get API Key <Code className="w-4 h-4 ml-2" /></Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </div>
    );
}
