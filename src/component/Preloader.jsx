import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = [
    "Hello", "नमस्ते", "নমস্কার", "నమస్కారం", "नमस्कार",
    "வணக்கம்", "નમસ્તે", "ನಮಸ್ಕಾರ", "നമസ്കാരം", "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", "Welcome"
];

const Preloader = ({ onLoadingComplete }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Faster intervals for a "shimmer" effect
        if (index === words.length - 1) {
            const finalTimeout = setTimeout(() => {
                onLoadingComplete();
            }, 1000);
            return () => clearTimeout(finalTimeout);
        }

        const timeout = setTimeout(() => {
            setIndex((prev) => prev + 1);
        }, index === 0 ? 1000 : 180);

        return () => clearTimeout(timeout);
    }, [index, onLoadingComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                y: "-100%",
                transition: { duration: 0.4, ease: [0.83, 0, 0.17, 1] }
            }}
            // Deep Obsidian Background
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0D0D0D] overflow-hidden"
        >
            {/* Subtle Radial Gradient for Depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#0D0D0D] to-[#0D0D0D]" />

            <div className="relative z-10 flex flex-col items-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="flex items-center gap-6"
                    >
                        {/* Elegant Gold Accent Line */}
                        <div className="h-10 w-[2px] bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent hidden md:block" />

                        <h1 className="text-white text-5xl md:text-7xl font-light tracking-wide">
                            {words[index]}
                        </h1>
                    </motion.div>
                </AnimatePresence>

                {/* Progress Percentage */}
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    className="absolute -bottom-16 text-[#D4AF37] font-mono text-xs tracking-[0.5em] uppercase"
                >
                    {Math.round((index / (words.length - 1)) * 100)}%
                </motion.span>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-8 left-8 flex flex-col gap-2">
                <div className="w-8 h-[1px] bg-zinc-800" />
                <div className="w-[1px] h-8 bg-zinc-800" />
            </div>
            <div className="absolute bottom-8 right-8 flex flex-col items-end gap-2">
                <div className="w-[1px] h-8 bg-zinc-800" />
                <div className="w-8 h-[1px] bg-zinc-800" />
            </div>
        </motion.div>
    );
};

export default Preloader;

// use some good font-style