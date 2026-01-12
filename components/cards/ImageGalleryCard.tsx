import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageIcon, Maximize2, Download, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ScrollFadeIn } from "@/components/ui/MotionWrappers"

export function ImageGalleryCard({ images }: { images: { url: string }[] }) {
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    if (!images || images.length === 0) return null;

    return (
        <>
            <Card className="rounded-[2.5rem] border border-white/10 bg-card/40 backdrop-blur-2xl shadow-2xl transition-all duration-500 overflow-hidden">
                <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-primary" />
                        Media Assets Vault ({images.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-2">
                    <div className="columns-2 md:columns-3 lg:columns-5 xl:columns-6 gap-6 space-y-6">
                        {images.map((img, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="relative group overflow-hidden rounded-[1.5rem] bg-white/5 border border-white/10 shadow-lg transition-all"
                            >
                                <img
                                    src={img.url}
                                    alt=""
                                    loading="lazy"
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).parentElement?.remove();
                                    }}
                                />

                                {/* Premium Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5 backdrop-blur-[2px]">
                                    <div className="flex items-center justify-between gap-3 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                                        <button
                                            onClick={() => setSelectedImg(img.url)}
                                            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl transition-all border border-white/20 active:scale-90"
                                            title="View Fullscreen"
                                        >
                                            <Maximize2 className="w-5 h-5 text-white" />
                                        </button>
                                        <a
                                            href={img.url}
                                            download
                                            target="_blank"
                                            className="p-3 rounded-2xl bg-primary hover:bg-primary/90 backdrop-blur-xl transition-all border border-primary/20 hover:shadow-glow active:scale-90"
                                            title="Download Image"
                                        >
                                            <Download className="w-5 h-5 text-white" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Premium Zoom Modal */}
            <AnimatePresence>
                {selectedImg && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImg(null)}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-background/90 backdrop-blur-2xl p-4 cursor-zoom-out"
                    >
                        <motion.button
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="absolute top-10 right-10 p-4 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all z-10"
                            onClick={() => setSelectedImg(null)}
                        >
                            <X className="w-6 h-6" />
                        </motion.button>

                        <motion.img
                            initial={{ scale: 0.8, y: 40, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.8, y: 40, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            src={selectedImg}
                            className="max-w-full max-h-full rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10"
                            alt="Preview"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
