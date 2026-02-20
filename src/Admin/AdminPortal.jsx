import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ShieldCheck, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL + '/api';

export default function AdminDashboard() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPending = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/admin/pending`, {
                // REQUIRED: Sends the JWT cookie to the server
                credentials: 'include'
            });

            const data = await res.json();

            if (res.ok) {
                // FIX: Ensure we are setting an array even if backend wraps it
                const usersArray = Array.isArray(data) ? data : (data.users || []);
                setPendingUsers(usersArray);
            } else {
                toast.error("Session Expired", { description: "Please login again." });
                window.location.href = '/admin/login';
            }
        } catch (err) {
            console.error("Fetch failed", err);
            toast.error("Connection Error", { description: "Could not reach the server." });
            setPendingUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPending(); }, []);

    const handleAction = async (id, action) => {
        const method = action === 'approve' ? 'PATCH' : 'DELETE';
        const endpoint = action === 'approve' ? `approve/${id}` : `reject/${id}`;

        try {
            const res = await fetch(`${API_BASE_URL}/admin/${endpoint}`, {
                method,
                credentials: 'include'
            });

            if (res.ok) {
                toast.success(`Node ${action === 'approve' ? 'Authorized' : 'Purged'}`);
                setPendingUsers(prev => prev.filter(user => user._id !== id));
            } else {
                toast.error("Action failed");
            }
        } catch (err) {
            console.error("Action failed", err);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-4xl font-black italic tracking-tighter flex items-center gap-3">
                            <ShieldCheck className="text-[#a3e635]" size={32} />
                            ORBIT_CONTROL
                        </h1>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mt-1">Manual node authorization</p>
                    </div>
                    <button onClick={fetchPending} className="p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
                        <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>

                {/* Grid with Defensive Mapping */}
                {pendingUsers.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-zinc-900 rounded-[3rem]">
                        <p className="text-zinc-600 font-bold uppercase tracking-widest">
                            {loading ? "Scanning for signals..." : "No signals awaiting alignment."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {/* FIX: Using optional chaining ?.map to prevent crashes */}
                            {pendingUsers?.map((user) => (
                                <motion.div
                                    key={user._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[2rem] flex flex-col items-center group hover:border-[#a3e635]/50 transition-all"
                                >
                                    <div className="relative mb-4">
                                        <img
                                            src={user.imageUrl || 'https://via.placeholder.com/150'}
                                            alt={user.name}
                                            className="w-32 h-32 rounded-full object-cover border-4 border-black shadow-2xl grayscale group-hover:grayscale-0 transition-all"
                                        />
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black px-3 py-1 rounded-full border border-zinc-800 text-[10px] font-bold whitespace-nowrap">
                                            {user.username || user.name}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-4 w-full">
                                        <button
                                            onClick={() => handleAction(user._id, 'reject')}
                                            className="flex-1 bg-zinc-800 hover:bg-red-900/40 hover:text-red-500 py-3 rounded-xl transition-all flex justify-center items-center"
                                        >
                                            <X size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleAction(user._id, 'approve')}
                                            className="flex-[2] bg-white text-black hover:bg-[#a3e635] font-black py-3 rounded-xl transition-all flex justify-center items-center gap-2"
                                        >
                                            <Check size={20} strokeWidth={4} />
                                            APPROVE
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}