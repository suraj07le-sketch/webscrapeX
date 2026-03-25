import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SocialMetadata } from '@/lib/scraper-types';
import { Share2, Twitter, Facebook } from 'lucide-react';
import Image from 'next/image';

interface SocialCardProps {
    social?: SocialMetadata;
}

export function SocialCard({ social }: SocialCardProps) {
    if (!social) return null;

    const hasOg = social.ogTitle || social.ogDescription || social.ogImage;
    const hasTwitter = social.twitterTitle || social.twitterDescription || social.twitterImage;

    if (!hasOg && !hasTwitter) return null;

    return (
        <Card className="h-full bg-card/40 backdrop-blur-md border border-border/50 hover:border-border/80 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-purple-500" />
                    Social Intelligence
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
                {/* Open Graph Section */}
                {hasOg && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Facebook className="w-4 h-4 text-blue-600" />
                            <span>Open Graph (Facebook / LinkedIn)</span>
                        </div>
                        <div className="rounded-lg border bg-card/60 overflow-hidden">
                            {social.ogImage && (
                                <div className="relative w-full h-48 bg-muted">
                                    <Image
                                        src={social.ogImage}
                                        alt="OG Image"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            )}
                            <div className="p-4 space-y-2">
                                {social.ogTitle && <h4 className="font-semibold leading-tight">{social.ogTitle}</h4>}
                                {social.ogDescription && <p className="text-xs text-muted-foreground line-clamp-3">{social.ogDescription}</p>}
                                {social.ogUrl && <p className="text-[10px] text-muted-foreground truncate">{social.ogUrl}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Twitter Section */}
                {hasTwitter && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Twitter className="w-4 h-4 text-sky-500" />
                            <span>Twitter Card {social.twitterCard ? `(${social.twitterCard})` : ''}</span>
                        </div>
                        <div className="rounded-lg border bg-card/60 overflow-hidden">
                            {social.twitterImage && (
                                <div className="relative w-full h-48 bg-muted">
                                    <Image
                                        src={social.twitterImage}
                                        alt="Twitter Image"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            )}
                            <div className="p-4 space-y-2">
                                {social.twitterTitle && <h4 className="font-semibold leading-tight">{social.twitterTitle}</h4>}
                                {social.twitterDescription && <p className="text-xs text-muted-foreground line-clamp-3">{social.twitterDescription}</p>}
                                {social.twitterCreator && <p className="text-xs text-sky-500">@{social.twitterCreator.replace('@', '')}</p>}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
