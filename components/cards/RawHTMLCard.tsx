import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Terminal, Copy } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function RawHTMLCard({ html }: { html: string }) {
    if (!html) return null;

    return (
        <Card className="rounded-[2rem] border border-white/10 bg-[#0d1117]/80 backdrop-blur-2xl shadow-2xl transition-all duration-500 overflow-hidden">
            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between border-b border-white/5">
                <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-primary" />
                    Source Inspector
                </CardTitle>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                    onClick={() => navigator.clipboard.writeText(html)}>
                    <Copy className="w-4 h-4 text-muted-foreground" />
                </button>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[600px] w-full">
                    <pre className="p-8 text-[13px] font-mono leading-relaxed text-blue-300 overflow-visible selection:bg-primary/30">
                        {html}
                    </pre>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
