'use client';

import * as React from 'react';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from '@/components/ui/command';
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Search,
    Type,
    Palette,
    ImageIcon,
    Link2,
    Code,
    Home,
    History,
    Command
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export function CommandMenu() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setOpen(true)}
                className="w-full h-11 px-4 flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group shadow-sm backdrop-blur-xl"
            >
                <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground/80 transition-colors">Search analysis...</span>
                </div>
                <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded-lg border border-white/10 text-[9px] font-bold text-muted-foreground/40 group-hover:text-primary/60 transition-colors">
                    <Command className="w-2.5 h-2.5" /> K
                </div>
            </motion.button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <div className="p-4 border-b border-white/10 bg-background/50 backdrop-blur-3xl">
                    <CommandInput placeholder="Search metrics, assets, or code..." className="h-12 text-lg border-none focus:ring-0" />
                </div>
                <CommandList className="max-h-[400px] bg-background/50 backdrop-blur-3xl p-2">
                    <CommandEmpty className="py-12 text-center text-sm text-muted-foreground">
                        No results for that query.
                    </CommandEmpty>
                    <CommandGroup heading="Core Actions" className="px-2 pb-4">
                        <CommandItem onSelect={() => runCommand(() => router.push('/'))} className="rounded-xl p-3 aria-selected:bg-primary/10 aria-selected:text-primary transition-all cursor-pointer">
                            <Home className="mr-3 h-5 w-5" />
                            <span className="font-bold">Return to Home</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator className="bg-white/5" />
                    <CommandGroup heading="Design Breakdown" className="px-2 pt-4">
                        <CommandItem onSelect={() => runCommand(() => {
                            const el = document.getElementById('metadata');
                            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        })} className="rounded-xl p-3 aria-selected:bg-primary/10 aria-selected:text-primary transition-all cursor-pointer">
                            <Search className="mr-3 h-5 w-5" />
                            <span className="font-bold">SEO & Metadata</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => {
                            const el = document.getElementById('colors');
                            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        })} className="rounded-xl p-3 aria-selected:bg-primary/10 aria-selected:text-primary transition-all cursor-pointer">
                            <Palette className="mr-3 h-5 w-5" />
                            <span className="font-bold">Palette Exploration</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => {
                            const el = document.getElementById('fonts');
                            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        })} className="rounded-xl p-3 aria-selected:bg-primary/10 aria-selected:text-primary transition-all cursor-pointer">
                            <Type className="mr-3 h-5 w-5" />
                            <span className="font-bold">Typography Scaling</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => {
                            const el = document.getElementById('images');
                            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        })} className="rounded-xl p-3 aria-selected:bg-primary/10 aria-selected:text-primary transition-all cursor-pointer">
                            <ImageIcon className="mr-3 h-5 w-5" />
                            <span className="font-bold">Media Library</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
