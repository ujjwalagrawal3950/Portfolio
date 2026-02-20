import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, ArrowUpRight, Zap, Eye, Layout, X, Binary } from "lucide-react";

// --- EXPANDED DATASET ---
const PROJECTS = [
  {
    id: "01",
    title: "Neuroflow",
    category: "AI Systems",
    icon: <Zap size={20} />,
    image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800",
    size: "md:col-span-2 md:row-span-2",
    description: "Built a predictive automation engine for creative workflows, reducing manual task time by 40%.",
    tech: ["React", "Python", "TensorFlow"],
    logic: "The challenge was visualizing complex neural nodes. We used force-directed graph logic to map data points in real-time."
  },
  {
    id: "02",
    title: "Aura UI",
    category: "Design Lab",
    icon: <Layout size={20} />,
    image: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=800",
    size: "md:col-span-1 md:row-span-1",
    description: "A comprehensive design system focused on glassmorphism and micro-interactions.",
    tech: ["Framer Motion", "Tailwind", "Radix UI"],
    logic: "Focused on perceived performance using skeletal loading and staggered animation entries for heavy data sets."
  },
  {
    id: "03",
    title: "Vision",
    category: "Branding",
    icon: <Eye size={20} />,
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800",
    size: "md:col-span-1 md:row-span-2",
    description: "Next-gen visual identity for a decentralized cloud infrastructure provider.",
    tech: ["Three.js", "GLSL", "Blender"],
    logic: "The brand core uses generative shapes that react to server load data, physically representing the infrastructure health."
  },
  {
    id: "04",
    title: "Static",
    category: "Web3",
    icon: <Zap size={20} />,
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800",
    size: "md:col-span-1 md:row-span-1",
    description: "A decentralized storage visualization tool for the InterPlanetary File System (IPFS).",
    tech: ["Web3.js", "Rust", "Node.js"],
    logic: "Solved high-latency data fetching by implementing a local caching layer with IndexedDB for instant UI updates."
  },
];

const BentoCard = ({ project, onClick }) => (
  <motion.div
    whileHover={{ y: -10 }}
    onClick={() => onClick(project)}
    className={`relative group overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-zinc-800 p-8 flex flex-col justify-between cursor-pointer transition-all duration-500 ${project.size}`}
  >
    <div
      className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 grayscale group-hover:grayscale-0 scale-110 group-hover:scale-100"
      style={{ backgroundImage: `url(${project.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    />
    <div className="relative z-10 flex justify-between items-start">
      <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-white">
        {project.icon}
      </div>
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg">
        <ArrowUpRight size={20} />
      </div>
    </div>
    <div className="relative z-10">
      <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase">{project.category}</span>
      <h3 className="text-3xl font-medium text-white mt-2 leading-tight tracking-tight">{project.title}</h3>
    </div>
  </motion.div>
);

export default function WorkPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const yTranslate = useTransform(pathProgress, [0, 0.4], ["0%", "-100%"]);

  return (
    <div className="bg-[#F2F0E9] min-h-screen selection:bg-zinc-900 selection:text-white overflow-x-hidden">

      {/* 1. HERO SECTION */}
      <section className="h-[80vh] flex flex-col justify-center px-6 md:px-20 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-8">
          <div className="w-8 h-[1px] bg-zinc-400" />
          <span className="text-xs font-bold tracking-[0.3em] text-zinc-400 uppercase">Interactive Developer</span>
        </motion.div>

        <h1 className="text-[10vw] md:text-[7rem] font-medium leading-[0.9] tracking-tighter text-zinc-900">
          ENGINEERING <br />
          <span className="italic font-serif font-light text-zinc-400">Human Experiences.</span>
        </h1>

        <p className="mt-10 text-xl md:text-2xl text-zinc-500 max-w-2xl font-light leading-relaxed">
          I build digital products that combine <span className="text-zinc-900 font-medium">technical precision</span> with <span className="text-zinc-900 font-medium">intuitive interaction</span>.
        </p>
      </section>

      {/* 2. WAVE TRANSITION */}
      <div ref={containerRef} className="relative z-20">
        <motion.div style={{ y: yTranslate }} className="absolute top-0 left-0 w-full pointer-events-none">
          <svg viewBox="0 0 1440 320" className="w-full fill-[#0D0D0D] rotate-180">
            <path d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </motion.div>

        {/* 3. WORK BENTO GRID */}
        <section className="bg-[#0D0D0D] pt-24 pb-48 px-6 md:px-20 relative -mt-1">
          <div className="max-w-7xl mx-auto">
            <header className="mb-20 flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-4xl md:text-6xl font-medium text-white tracking-tighter">
                  Selected <span className="text-zinc-600">Work.</span>
                </h2>
              </div>
              <div className="hidden md:flex items-center gap-4 text-zinc-500 font-mono text-[10px] tracking-widest uppercase bg-white/5 px-6 py-3 rounded-full border border-white/5">
                <Binary size={14} /> Systems Archive / 2026
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[300px] gap-6">
              {PROJECTS.map((proj) => (
                <BentoCard key={proj.id} project={proj} onClick={setSelectedProject} />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* 4. SIDE PANEL OVERLAY WITH LEFT-SIDE INTERACTIVE CONTENT */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* FULL SCREEN BACKGROUND */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center"
            >
              {/* --- NEW: LEFT SIDE INTERACTIVE CONTENT (Filling the "Unused Space") --- */}
              <div className="hidden lg:flex flex-col justify-between w-[calc(100%-650px)] h-full p-20 pointer-events-none overflow-hidden">

                {/* Top Telemetry Log */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-[#a3e635] rounded-full animate-pulse shadow-[0_0_10px_#a3e635]" />
                    <span className="text-[#a3e635] font-mono text-[10px] tracking-[0.3em] uppercase">Node Status: Online</span>
                  </div>

                  <div className="text-zinc-600 font-mono text-[9px] leading-relaxed uppercase tracking-widest">
                    {/* Dynamic log based on project tech stack */}
                    {selectedProject.tech.map((t, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                        className="flex gap-4 mb-1"
                      >
                        <span className="text-zinc-800">[{new Date().getFullYear()}.0{i}]</span>
                        <span className="group-hover:text-zinc-400">Mounting_Module_{t.replace(/\s+/g, '_')}...</span>
                        <span className="text-zinc-400">OK</span>
                      </motion.div>
                    ))}
                    <div className="mt-4 text-zinc-800">Checksum: 0x{selectedProject.id}F2... Success</div>
                  </div>
                </motion.div>

                {/* Massive Background Project Number */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.05, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="absolute left-[-5%] top-[20%] pointer-events-none"
                >
                  <h1 className="text-[40vw] font-black leading-none select-none text-white tracking-tighter italic">
                    {selectedProject.id}
                  </h1>
                </motion.div>

                {/* Bottom HUD Visualizer */}
                <div className="flex justify-between items-end relative z-10">
                  <div className="space-y-2">
                    <div className="text-zinc-700 font-mono text-[8px] uppercase tracking-[0.6em]">Ref_Index: {selectedProject.title.toUpperCase()}</div>
                    <div className="text-zinc-800 font-mono text-[8px] uppercase tracking-[0.6em]">Location: Systems_Archive_00{selectedProject.id}</div>
                  </div>

                  {/* Frequency Visualizer Animation */}
                  <div className="flex gap-1 h-16 items-end">
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, Math.random() * 40 + 10, 4] }}
                        transition={{ repeat: Infinity, duration: 1.2 + Math.random(), ease: "easeInOut" }}
                        className="w-[1px] bg-zinc-800"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Invisible Clickable Area to Close */}
              <div
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 z-[-1] cursor-zoom-out"
              />
            </motion.div>

            {/* THE SIDE PANEL BRIEF */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 w-full md:w-[650px] h-screen bg-zinc-950 z-[101] p-8 md:p-16 overflow-y-auto border-l border-white/10 shadow-[-50px_0_100px_rgba(0,0,0,0.9)]"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="mb-12 group flex items-center gap-3 text-zinc-500 hover:text-white transition-all"
              >
                <div className="p-3 bg-white/5 rounded-full group-hover:bg-white/10 group-hover:rotate-90 transition-all duration-500">
                  <X size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Close Project</span>
              </button>

              <div className="space-y-12">
                <section>
                  <span className="text-zinc-500 font-mono text-xs tracking-[0.4em] uppercase">{selectedProject.id} // Detailed Report</span>
                  <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mt-4 leading-tight">{selectedProject.title}</h2>
                </section>

                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group">
                  <img src={selectedProject.image} className="w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-100" alt={selectedProject.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-40" />
                </div>

                <div className="grid grid-cols-1 gap-12">
                  <section className="space-y-4">
                    <h4 className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">The Objective</h4>
                    <p className="text-xl text-zinc-300 leading-relaxed font-light">{selectedProject.description}</p>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">Technical Logic</h4>
                    <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-[2px] h-full bg-[#a3e635] transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700" />
                      <p className="text-md text-zinc-400 leading-relaxed italic font-light relative z-10">
                        "{selectedProject.logic}"
                      </p>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">Core Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech.map(t => (
                        <span key={t} className="px-5 py-2 bg-zinc-900 rounded-full text-white text-[11px] font-mono border border-zinc-800 tracking-tighter hover:border-white/20 transition-all">
                          {t}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>

                <button className="group w-full py-6 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 hover:bg-[#a3e635] transition-all shadow-xl active:scale-95">
                  View Repository <Binary size={16} className="group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}