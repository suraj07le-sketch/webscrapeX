import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Zap, FileText, LayoutGrid } from "lucide-react";
import { ScrapeMode } from "@/lib/scraper-types";

interface ScrapeModeSelectorProps {
    mode: ScrapeMode;
    setMode: (mode: ScrapeMode) => void;
}

export function ScrapeModeSelector({ mode, setMode }: ScrapeModeSelectorProps) {
    const modes = [
        { value: 'full', label: 'Full Analysis', icon: LayoutGrid, color: 'text-primary' },
        { value: 'social', label: 'Social Media', icon: Zap, color: 'text-purple-500' },
        { value: 'content', label: 'Content Only', icon: FileText, color: 'text-emerald-500' },
    ];

    const currentMode = modes.find(m => m.value === mode) || modes[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-10 md:h-full px-3 md:px-4 gap-1.5 md:gap-2 md:border-r md:border-white/10 rounded-lg md:rounded-none md:rounded-l-[2rem] hover:bg-white/5 data-[state=open]:bg-white/5 transition-colors"
                >
                    <currentMode.icon className={`w-4 h-4 ${currentMode.color}`} />
                    <span className="font-medium text-xs md:text-sm">{currentMode.label}</span>
                    <ChevronDown className="w-3 h-3 text-muted-foreground opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-background/80 backdrop-blur-xl border-white/10">
                {modes.map((m) => (
                    <DropdownMenuItem
                        key={m.value}
                        onClick={() => setMode(m.value as ScrapeMode)}
                        className="gap-2 cursor-pointer focus:bg-primary/10"
                    >
                        <m.icon className={`w-4 h-4 ${m.color}`} />
                        <span>{m.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
