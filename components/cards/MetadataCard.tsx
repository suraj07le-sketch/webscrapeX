import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info, Globe } from "lucide-react"

interface Metadata {
    title: string;
    description: string;
    keywords: string[];
    favicon: string;
}

export function MetadataCard({ metadata }: { metadata: Metadata }) {
    if (!metadata) return null;

    return (
        <Card className="rounded-[2rem] border border-white/10 bg-card/40 backdrop-blur-2xl shadow-2xl overflow-hidden group transition-all duration-500 hover:shadow-primary/5">
            <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    Site Metadata
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-2 space-y-6">
                <div className="flex items-start gap-6">
                    <div className="relative group/fav">
                        <div className="absolute -inset-1 bg-gradient-to-br from-primary to-purple-600 rounded-2xl blur opacity-20 group-hover/fav:opacity-40 transition duration-500" />
                        {metadata.favicon ? (
                            <img src={metadata.favicon} alt="" className="relative w-16 h-16 rounded-2xl bg-background/50 p-2 shadow-inner object-contain" />
                        ) : (
                            <div className="relative w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Globe className="w-8 h-8 text-primary/40" />
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-extrabold text-3xl leading-tight tracking-tight text-foreground/90">{metadata.title || "No Title"}</h3>
                        <p className="text-base text-muted-foreground/80 leading-relaxed max-w-lg">{metadata.description || "No description found."}</p>
                    </div>
                </div>

                {metadata.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                        {metadata.keywords.map((kw, i) => (
                            <Badge key={i} variant="secondary" className="bg-white/5 border-white/10 text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-wider text-muted-foreground transition-colors hover:text-primary hover:bg-primary/5">
                                {kw}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
