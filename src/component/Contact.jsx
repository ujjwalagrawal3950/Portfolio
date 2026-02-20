import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Linkedin, Instagram, ArrowUpRight, ArrowRight, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const ConnectCard = ({ href, icon: Icon, title, subtitle, delay, isEmail, emailValue }) => {
    const [showEmail, setShowEmail] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(emailValue);
        setCopied(true);
        toast.success("Email copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    // If it's the email card, we use a div/button behavior instead of a direct anchor
    const CardWrapper = isEmail ? "div" : motion.a;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="h-64"
        >
            <CardWrapper
                href={!isEmail ? href : undefined}
                target={!isEmail ? "_blank" : undefined}
                onClick={() => isEmail && setShowEmail(true)}
                className={`group relative flex flex-col justify-between p-8 rounded-[2rem] bg-white border border-zinc-200 h-full transition-all duration-300 ${isEmail && !showEmail ? "cursor-pointer hover:border-zinc-400" : "border-zinc-200"
                    }`}
            >
                <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300">
                        <Icon size={22} strokeWidth={1.5} />
                    </div>
                    {!showEmail && <ArrowUpRight size={20} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />}
                </div>

                <div className="relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {!showEmail ? (
                            <motion.div
                                key="title"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                            >
                                <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{subtitle}</p>
                                <h4 className="text-2xl font-semibold text-zinc-900 tracking-tight">{title}</h4>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="email"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-2"
                            >
                                <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em]">Direct Signal</p>
                                <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                                    <span className="text-[18px] font-mono font-medium text-zinc-900 truncate mr-2">
                                        {emailValue}
                                    </span>
                                    <button
                                        onClick={handleCopy}
                                        className="p-2 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all active:scale-90"
                                    >
                                        {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </CardWrapper>
        </motion.div>
    );
};

export default function ConnectPage() {
    return (
        <section id="contact" className="relative bg-zinc-50 py-24 px-6 rounded-t-[3rem] md:rounded-t-[5rem] -mt-16 z-30 shadow-2xl">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-gradient-to-bl from-orange-100/50 to-transparent" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-gradient-to-tr from-blue-50/50 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-10">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="inline-flex items-center justify-start gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-6"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Available for new projects
                        </motion.div>

                        <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-bold text-zinc-900 tracking-tighter leading-[0.8] mb-4">
                            Let's <span className="text-zinc-300 italic font-serif">talk.</span>
                        </h2>
                    </div>

                    <p className="text-zinc-500 text-lg md:text-xl max-w-sm leading-relaxed font-medium">
                        Mera design philosophy simple hai: <br />
                        <span className="text-zinc-900">Make it work, then make it beautiful.</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <ConnectCard
                        isEmail={true}
                        emailValue={import.meta.env.VITE_EMAIL_ADDRESS}
                        icon={Mail}
                        subtitle="Inquiry"
                        title="Email Me"
                        delay={0.1}
                    />
                    <ConnectCard
                        icon={Linkedin}
                        subtitle="Professional"
                        title="LinkedIn"
                        href="https://www.linkedin.com/in/ujjwal-agrawal-b1ba312b3"
                        delay={0.2}
                    />
                    <ConnectCard
                        icon={Instagram}
                        subtitle="Social"
                        title="Instagram"
                        href="https://www.instagram.com/itz_ujjwal_agrawal/"
                        delay={0.3}
                    />
                </div>

                <footer className="mt-32 pt-10 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-zinc-400 text-xs font-semibold tracking-widest uppercase">
                        © 2026 Crafted with precision
                    </p>

                    <a href="#home" className="no-underline">
                        <button
                            type="button"
                            className="group flex items-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-orange-600 transition-all duration-500 active:scale-95"
                        >
                            Back to top
                            <ArrowRight size={16} className="-rotate-90 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </a>
                </footer>
            </div>
        </section>
    );
}