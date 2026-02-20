import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Work', href: '#work' },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 flex justify-center w-full z-50 px-4">
      {/* Container: Responsive width */}
      <nav className="relative w-full md:w-fit max-w-4xl flex flex-col items-center">

        {/* Main Glass Bar */}
        <div className="w-full bg-zinc-950/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex items-center justify-between gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">

          {/* Logo with Dummy LinkedIn Link */}
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-base font-semibold px-4 cursor-pointer hover:text-blue-400 transition-colors"
          >
            Ujjwal
          </a>

          {/* Desktop Links (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-zinc-400 hover:text-white hover:bg-white/5 px-4 py-2 rounded-xl transition-all text-base font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-2">
            {/* Desktop Connect Button */}
            <a
              href="#contact"
              className="hidden md:flex bg-white text-black px-5 py-2 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all active:scale-95"
            >
              Connect
            </a>

            {/* Mobile Menu Button - Corrected structure */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 px-4 py-2 rounded-xl transition-all active:scale-95"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-white">Menu</span>
              <div className="w-5 h-4 flex flex-col justify-between items-end">
                <span className={`h-[2px] bg-white rounded-full transition-all duration-300 ${isOpen ? 'w-5 rotate-45 translate-y-[7px]' : 'w-5'}`} />
                <span className={`h-[2px] bg-white rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-3'}`} />
                <span className={`h-[2px] bg-white rounded-full transition-all duration-300 ${isOpen ? 'w-5 -rotate-45 -translate-y-[7px]' : 'w-4'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Animated Mobile Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="absolute top-[calc(100%+12px)] left-0 right-0 bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 shadow-2xl md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between text-zinc-400 hover:text-white hover:bg-white/5 px-5 py-4 rounded-xl text-lg font-medium transition-colors"
                  >
                    {link.name}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                  </a>
                ))}
                <div className="mt-2 p-1 border-t border-white/5 pt-3">
                  <a
                    href="#contact"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-white text-black py-4 rounded-xl text-center font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                  >
                    Let's Connect
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="rotate-45"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default Navbar;