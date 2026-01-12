import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link2, ExternalLink, Globe } from "lucide-react"

export function LinksCard({ links }: { links: string[] }) {
    if (!links || links.length === 0) return null;

    return (
        <Card className="rounded-[2rem] border border-white/10 bg-card/40 backdrop-blur-2xl shadow-2xl h-full transition-all duration-500 overflow-hidden">
            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-emerald-500" />
                    Site Architecture ({links.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {links.slice(0, 15).map((link, i) => (
                        <div key={i} className="group flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all hover:bg-white/10">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2 rounded-lg bg-background/50 text-emerald-500 opacity-70">
                                    <Globe className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs font-mono truncate text-muted-foreground group-hover:text-foreground transition-colors">{link}</span>
                            </div>
                            <a href={link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground/50 hover:text-primary transition-all">
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    ))}
                    {links.length > 15 && (
                        <p className="text-[10px] text-center text-muted-foreground/40 font-bold uppercase tracking-widest pt-4 border-t border-white/5 col-span-full">
                            + {links.length - 15} more internal routes
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
