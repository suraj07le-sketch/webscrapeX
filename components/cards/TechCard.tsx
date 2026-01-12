import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, Zap } from "lucide-react"
import { motion } from "framer-motion"

export function TechCard({ techs }: { techs: string[] }) {
    if (!techs || techs.length === 0) return null;

    // Helper to get devicon names
    const getDevicon = (tech: string) => {
        const lower = tech.toLowerCase();
        if (lower.includes('next')) return 'nextjs';
        if (lower.includes('react')) return 'react';
        if (lower.includes('tailwind')) return 'tailwindcss';
        if (lower.includes('bootstrap')) return 'bootstrap';
        if (lower.includes('google analytics')) return 'google';
        if (lower.includes('vue')) return 'vuejs';
        if (lower.includes('angular')) return 'angular';
        if (lower.includes('wordpress')) return 'wordpress';
        if (lower.includes('shopify')) return 'shopify';
        return null;
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <Card className="rounded-[2.5rem] border border-white/10 bg-card/40 backdrop-blur-2xl shadow-2xl h-full transition-all duration-500 overflow-hidden">
            <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary" />
                    Technology Intelligence
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-2">
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex flex-wrap gap-4"
                >
                    {techs.map((tech, i) => {
                        const icon = getDevicon(tech);
                        return (
                            <motion.div
                                key={i}
                                variants={item}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="group flex items-center gap-3 p-3 pr-6 rounded-2xl bg-white/5 border border-white/10 shadow-lg transition-all hover:bg-white/10 hover:border-primary/20"
                            >
                                <div className="p-2.5 rounded-xl bg-background/50 shadow-inner group-hover:rotate-12 transition-transform duration-500">
                                    {icon ? (
                                        <img
                                            src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}/${icon}-original.svg`}
                                            alt=""
                                            className="w-6 h-6"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <Zap className="w-4 h-4 text-primary" />
                                    )}
                                </div>
                                <span className="font-black text-sm tracking-tight text-foreground/80 group-hover:text-foreground transition-colors">
                                    {tech}
                                </span>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </CardContent>
        </Card>
    )
}
