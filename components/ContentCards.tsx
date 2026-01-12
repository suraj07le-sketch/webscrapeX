"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExternalLink, Hash, Link as LinkIcon, Image as ImageIcon, Type, AlignLeft } from "lucide-react"

interface ContentData {
    headings: {
        h1: string[];
        h2: string[];
        h3: string[];
        h4: string[];
        h5: string[];
        h6: string[];
    };
    text_content: {
        paragraphs: string[];
        summary: string;
    };
    links: {
        internal: string[];
        external: string[];
        social: string[];
        total_count: number;
    };
    images: {
        url: string;
        alt: string;
    }[];
}

export default function ContentCards({ content }: { content: ContentData }) {
    if (!content) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Typography & Headings */}
            <Card className="md:col-span-1 border-primary/20 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Type className="w-5 h-5 text-primary" />
                        Typography Structure
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs">H1</span>
                            Main Heading
                        </h4>
                        {content.headings.h1.length > 0 ? (
                            content.headings.h1.map((h, i) => (
                                <p key={i} className="text-lg font-bold leading-tight">{h}</p>
                            ))
                        ) : <span className="text-sm text-muted-foreground italic">No H1 found</span>}
                    </div>

                    <div className="space-y-2 pt-2">
                        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs">H2-H3</span>
                            Structure
                        </h4>
                        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                            {content.headings.h2.map((h, i) => (
                                <div key={`h2-${i}`} className="mb-2">
                                    <span className="text-xs font-mono text-muted-foreground mr-2">H2</span>
                                    <span className="font-medium">{h}</span>
                                </div>
                            ))}
                            {content.headings.h3.map((h, i) => (
                                <div key={`h3-${i}`} className="mb-1 ml-4">
                                    <span className="text-xs font-mono text-muted-foreground mr-2">H3</span>
                                    <span className="text-sm">{h}</span>
                                </div>
                            ))}
                            {content.headings.h2.length === 0 && content.headings.h3.length === 0 && (
                                <span className="text-sm text-muted-foreground italic">No subheadings found</span>
                            )}
                        </ScrollArea>
                    </div>
                </CardContent>
            </Card>

            {/* Links Analysis */}
            <Card className="md:col-span-1 border-blue-500/20 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <LinkIcon className="w-5 h-5 text-blue-500" />
                        Link Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-muted p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold">{content.links.internal.length}</div>
                            <div className="text-xs text-muted-foreground">Internal</div>
                        </div>
                        <div className="bg-muted p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold">{content.links.external.length}</div>
                            <div className="text-xs text-muted-foreground">External</div>
                        </div>
                        <div className="bg-muted p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold">{content.links.social.length}</div>
                            <div className="text-xs text-muted-foreground">Social</div>
                        </div>
                    </div>

                    {content.links.social.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {content.links.social.map((link, i) => (
                                <Badge key={i} variant="secondary" className="px-2 py-1">
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    {new URL(link).hostname.replace('www.', '')}
                                </Badge>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Text Content Summary */}
            <Card className="md:col-span-1 border-green-500/20 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <AlignLeft className="w-5 h-5 text-green-500" />
                        Content Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {content.text_content.summary || "No text content extracted."}
                    </p>
                    <div className="mt-4 text-xs text-muted-foreground">
                        Total Paragraphs: <span className="font-mono font-bold text-foreground">{content.text_content.paragraphs.length}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Image Gallery */}
            <Card className="md:col-span-1 border-purple-500/20 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <ImageIcon className="w-5 h-5 text-purple-500" />
                        Image Gallery ({content.images.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[200px] w-full rounded-md border p-2">
                        <div className="grid grid-cols-3 gap-2">
                            {content.images.map((img, i) => (
                                <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-muted group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={img.url}
                                        alt={img.alt}
                                        className="object-cover w-full h-full transition-transform group-hover:scale-110"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                        {content.images.length === 0 && (
                            <div className="text-sm text-muted-foreground italic text-center py-8">No images found</div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>

        </div>
    )
}
