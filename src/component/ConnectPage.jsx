import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle2, Zap, Users, Loader2 } from 'lucide-react';
import Matter from 'matter-js';
import { toast } from 'sonner';

// Change this to your actual backend URL
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export default function ConnectPage() {
    // --- FORM STATE ---
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // --- PHYSICS & UI STATE ---
    const [dbUsers, setDbUsers] = useState([]);
    const [hoveredUser, setHoveredUser] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const sceneRef = useRef(null);
    const engineRef = useRef(null);
    const worldRef = useRef(null);

    // 1. Fetch Approved Users from Backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/users`);
                const data = await response.json();
                setDbUsers(data);
            } catch (err) {
                console.error("Failed to sync with Orbit:", err);
            }
        };
        fetchUsers();
    }, []);

    // 2. Initialize Matter.js Physics
    useEffect(() => {
        if (dbUsers.length === 0) return;

        const engine = Matter.Engine.create();
        engine.gravity.y = 0;
        engineRef.current = engine;
        worldRef.current = engine.world;

        const container = sceneRef.current;
        const { clientWidth: width, clientHeight: height } = container;

        const render = Matter.Render.create({
            element: container,
            engine: engine,
            options: {
                width, height,
                wireframes: false,
                background: 'transparent',
                pixelRatio: 1
            },
        });

        const particles = dbUsers.map(user => {
            const size = 90;
            const body = Matter.Bodies.circle(
                Math.random() * width,
                Math.random() * height,
                size / 2,
                {
                    restitution: 0.8,
                    frictionAir: 0.05,
                    render: {
                        sprite: {
                            texture: user.imageUrl,
                            xScale: size / 300,
                            yScale: size / 300
                        }
                    }
                }
            );
            body.userName = user.name;
            Matter.Body.setVelocity(body, {
                x: (Math.random() - 0.5) * 4,
                y: (Math.random() - 0.5) * 4
            });
            return body;
        });

        const wallOptions = { isStatic: true, render: { visible: false } };
        const walls = [
            Matter.Bodies.rectangle(width / 2, -20, width, 40, wallOptions),
            Matter.Bodies.rectangle(width / 2, height + 20, width, 40, wallOptions),
            Matter.Bodies.rectangle(-20, height / 2, 40, height, wallOptions),
            Matter.Bodies.rectangle(width + 20, height / 2, 40, height, wallOptions)
        ];

        const mouse = Matter.Mouse.create(render.canvas);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: { stiffness: 0.1, render: { visible: false } }
        });

        Matter.Events.on(mouseConstraint, "mousemove", (e) => {
            const found = Matter.Query.point(particles, e.mouse.position)[0];
            if (found) {
                setHoveredUser(found.userName);
                setTooltipPos({ x: e.mouse.position.x, y: e.mouse.position.y });
            } else {
                setHoveredUser(null);
            }
        });

        Matter.Events.on(engine, 'beforeUpdate', () => {
            const center = { x: width / 2, y: height / 2 };
            particles.forEach(p => {
                Matter.Body.applyForce(p, p.position, {
                    x: (center.x - p.position.x) * 0.000015,
                    y: (center.y - p.position.y) * 0.000015
                });
            });
        });

        Matter.World.add(engine.world, [...walls, ...particles, mouseConstraint]);
        Matter.Runner.run(Matter.Runner.create(), engine);
        Matter.Render.run(render);

        return () => {
            Matter.Render.stop(render);
            Matter.Engine.clear(engine);
            render.canvas.remove();
        };
    }, [dbUsers]);

    // 3. Handle Form Submission
    const handleConnect = async (e) => {
        e.preventDefault();
        if (file && file.size > 5 * 1024 * 1024) {
            toast.error("Transmission Blocked", { description: "Asset too heavy. Max 5MB allowed." });
            return;
        }

        if (!file || !name) {
            toast.warning("Incomplete Data", { description: "Please provide both a name and a node asset." });
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', file);

        toast.promise(
            async () => {
                const response = await fetch(`${API_BASE_URL}/connect`, {
                    method: 'POST',
                    body: formData,
                });
                if (response.status === 429) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Rate limit exceeded");
                }
                if (!response.ok) throw new Error("Server rejected transmission");
                return response.json();
            },
            {
                loading: 'Initiating Your Request...',
                success: () => {
                    setName('');
                    setFile(null);
                    setShowSuccess(true);
                    return `Your Signal "${name}" successfully sent for approval.`;
                },
                error: (err) => err.message || "Orbit transmission failed.",
            }
        );
        setIsSubmitting(false);
    };

    return (
        <div className="relative min-h-screen bg-[#030303] text-white p-6 md:p-12 overflow-hidden selection:bg-[#a3e635] selection:text-black">

            {/* BACKGROUND DECOR */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-12 gap-12 items-center min-h-[80vh]">

                {/* LEFT SIDE: HEADER & FORM */}
                <div className="lg:col-span-4 space-y-10">
                    <header>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                            className="text-7xl font-black italic tracking-tighter leading-none"
                        >
                            THE <span className="text-[#a3e635]">ORBIT</span>
                        </motion.h1>
                        <p className="text-zinc-500 mt-4 font-bold text-sm tracking-widest uppercase">
                            Collective Intelligence Node
                        </p>
                    </header>

                    <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
                        {!showSuccess ? (
                            <form className="space-y-10" onSubmit={handleConnect}> {/* Increased spacing from 6 to 10 */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Identity Tag</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Alias..."
                                            required
                                            className="w-full bg-black/50 border border-zinc-800 p-4 rounded-2xl focus:border-[#a3e635] outline-none transition-all font-mono"
                                        />

                                        {/* DYNAMIC PREVIEW LINE */}
                                        <AnimatePresence>
                                            {name.length > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -5 }}
                                                    className="absolute left-1 top-[110%] w-full pointer-events-none"
                                                >
                                                    <span className="text-[13px] font-mono text-[#a3e635] animate-pulse block leading-relaxed italic text-start">
                                                        "Sir Aadhe Paise le lena lekin intern pe hire kar lo"
                                                    </span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Added significant mt-12 to create the gap between text and upload container */}
                                <div className="relative group border-2 border-dashed border-zinc-800 rounded-2xl p-8 text-center hover:border-[#a3e635]/40 transition-all cursor-pointer mt-16">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        required
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                    <Upload className="mx-auto text-zinc-600 group-hover:text-[#a3e635] mb-2 transition-all" />
                                    <span className="text-xs font-black text-zinc-500 uppercase block truncate">
                                        {file ? file.name : "Inject Image"}
                                    </span>
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#a3e635] transition-all active:scale-95 group disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Zap className="w-4 h-4 fill-black" />}
                                    {isSubmitting ? "TRANSMITTING..." : "JOIN FIELD"}
                                </button>
                            </form>
                        ) : (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
                                <CheckCircle2 className="w-12 h-12 text-[#a3e635] mx-auto mb-4" />
                                <h3 className="text-xl font-black italic tracking-tighter uppercase">Signal Sent</h3>
                                <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
                                    Your particle has been queued. <br /> It will appear once approved.
                                </p>
                                <button onClick={() => setShowSuccess(false)} className="mt-6 text-[10px] font-bold text-zinc-400 border border-zinc-800 px-4 py-2 rounded-full hover:bg-zinc-800 transition-all uppercase tracking-widest">New Transmission</button>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE: PHYSICS FIELD */}
                <div className="lg:col-span-8 relative h-[600px] lg:h-[700px] bg-zinc-950/50 border border-zinc-900 rounded-[3.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)]">
                    <div className="absolute top-8 left-8 z-20 flex items-center gap-3 bg-black/60 backdrop-blur-md border border-zinc-800 px-4 py-2 rounded-full">
                        <div className="w-2 h-2 bg-[#a3e635] rounded-full animate-pulse shadow-[0_0_10px_#a3e635]" />
                        <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase flex items-center gap-2">
                            <Users size={12} /> {dbUsers.length} Nodes Synchronized
                        </span>
                    </div>

                    <div ref={sceneRef} className="w-full h-full cursor-grab active:cursor-grabbing relative z-10 
                        [&>canvas]:brightness-110 [&>canvas]:contrast-125"
                    />

                    <AnimatePresence>
                        {hoveredUser && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                style={{ left: tooltipPos.x, top: tooltipPos.y - 70 }}
                                className="absolute pointer-events-none z-50 -translate-x-1/2"
                            >
                                <div className="bg-[#a3e635] text-black px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-tighter shadow-[0_10px_30px_rgba(163,230,53,0.3)] flex items-center gap-2">
                                    {hoveredUser}
                                </div>
                                <div className="w-3 h-3 bg-[#a3e635] rotate-45 mx-auto -mt-1.5" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="absolute bottom-8 right-10 pointer-events-none text-right">
                        <div className="text-[8px] font-black text-zinc-700 tracking-[0.6em] uppercase">Status: Operating</div>
                        <div className="text-[8px] font-black text-zinc-800 tracking-[0.6em] uppercase">Encrypted_Mesh_Network</div>
                    </div>
                </div>
            </div>
        </div>
    );
}