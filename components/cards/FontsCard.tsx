import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Type, ArrowRight, MousePointer2 } from "lucide-react"
import { motion } from "framer-motion"

export function FontsCard({ fonts }: { fonts: string[] }) {
    if (!fonts || fonts.length === 0) return null;

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
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <Card className="rounded-[2.5rem] border border-white/10 bg-card/40 backdrop-blur-2xl shadow-2xl h-full transition-all duration-500 group/card overflow-hidden">
            <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                    <Type className="w-4 h-4 text-primary" />
                    Typography & Typefaces
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-2 space-y-6">
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="space-y-4"
                >
                    {fonts.map((font, i) => (
                        <motion.div
                            key={i}
                            variants={item}
                            className="group/font p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/20 transition-all hover:bg-white/10 relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono font-black text-primary/60 uppercase tracking-widest">{font}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground/20 group-hover/font:text-primary transition-all group-hover/font:translate-x-1" />
                            </div>

                            <motion.p
                                whileHover={{ scale: 1.05, x: 10 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="text-3xl md:text-4xl truncate text-foreground/90 origin-left cursor-default select-none"
                                style={{ fontFamily: font }}
                            >
                                The quick brown fox jumps over the lazy dog
                            </motion.p>

                            <div className="absolute right-6 bottom-6 opacity-0 group-hover/font:opacity-100 transition-opacity">
                                <MousePointer2 className="w-4 h-4 text-primary animate-pulse" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </CardContent>
        </Card>
    )
}
