"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { DynamicBackground } from "@/components/ui/DynamicBackground";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, User, Bell, Shield, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-transparent font-sans relative flex items-stretch overflow-x-hidden text-foreground">
            <DynamicBackground colors={[]} />
            <Sidebar />

            <div className="flex-1 ml-64 p-8 pt-24 lg:p-12 lg:pt-24 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto space-y-8"
                >
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                            <Settings className="w-3 h-3" />
                            Configuration
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Settings</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Manage your account usage, preferences, and billing information.
                        </p>
                    </div>

                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full max-w-md grid-cols-4 h-12 bg-white/5 border border-white/10 p-1 mb-8">
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="billing">Billing</TabsTrigger>
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="notifications">Alerts</TabsTrigger>
                        </TabsList>

                        <TabsContent value="general" className="space-y-6">
                            <Card className="border-white/10 bg-card/40 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle>Appearance</CardTitle>
                                    <CardDescription>
                                        Customize how WebScrapeX looks on your device.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label>Theme Preference</Label>
                                            <p className="text-sm text-muted-foreground">Toggle between light and dark modes.</p>
                                        </div>
                                        <ThemeToggle />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-white/10 bg-card/40 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle>Export Defaults</CardTitle>
                                    <CardDescription>
                                        Set your preferred default formats for exports.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Image Format</Label>
                                            <select className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                                <option>Original (Preserve)</option>
                                                <option>WEBP</option>
                                                <option>PNG</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Code Style</Label>
                                            <select className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                                <option>Tailwind CSS</option>
                                                <option>Standard CSS</option>
                                            </select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="billing" className="space-y-6">
                            <Card className="border-white/10 bg-card/40 backdrop-blur-md overflow-hidden">
                                <div className="h-32 bg-gradient-to-r from-primary/20 to-purple-600/20 flex items-center justify-center">
                                    <Wallet className="w-12 h-12 text-primary opacity-50" />
                                </div>
                                <CardHeader>
                                    <CardTitle>Pro Plan (Active)</CardTitle>
                                    <CardDescription>
                                        You are currently on the Pro plan. Billing cycle renews on Feb 12, 2026.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                                        <div>
                                            <div className="font-bold">Next Invoice</div>
                                            <div className="text-sm text-muted-foreground">$29.00 USD</div>
                                        </div>
                                        <Button variant="outline">Manage Subscription</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="account" className="space-y-6">
                            <Card className="border-white/10 bg-card/40 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                    <CardDescription>
                                        Update your account details and public profile.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" defaultValue="user@example.com" disabled className="bg-white/5" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Display Name</Label>
                                        <Input id="name" defaultValue="Web Scraper User" className="bg-white/5" />
                                    </div>
                                    <Button className="w-fit">Save Changes</Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="notifications" className="space-y-6">
                            <Card className="border-white/10 bg-card/40 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle>Email Notifications</CardTitle>
                                    <CardDescription>
                                        Manage what emails you receive from us.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between space-x-2">
                                        <Label htmlFor="marketing" className="flex flex-col space-y-1">
                                            <span>Weekly Digest</span>
                                            <span className="font-normal text-xs text-muted-foreground">Summary of your scraping activities</span>
                                        </Label>
                                        {/* Placeholder Switch */}
                                        <div className="h-6 w-11 rounded-full bg-primary/20 border border-primary/50 relative">
                                            <div className="h-4 w-4 rounded-full bg-primary absolute top-1 left-6 shadow-sm"></div>
                                        </div>
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
