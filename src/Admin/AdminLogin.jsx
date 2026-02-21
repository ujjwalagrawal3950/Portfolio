import React, { useState } from 'react';
import { toast } from 'sonner';
import { ShieldCheck, Lock, Loader2, CloudCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Add this at top

const AdminLogin = () => {
    const [creds, setCreds] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initialize hook

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log(import.meta.env.VITE_BACKEND_URL)
            // FIX 1: Explicitly define the full backend URL if proxy isn't set
            // Change 5000 to whatever port your Express server is running on
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(creds),
                // Correct enum value is 'include'
                credentials: 'include',
            });
            const data = await res.json();

            if (res.ok) {
                // GUARANTEED FIX: Save the actual token for Mobile/Safari
                localStorage.setItem('is_admin', 'true');
                localStorage.setItem('admin_token', data.token);

                toast.success("Identity Verified", {
                    description: "Establishing secure link to Command Center..."
                });

                setTimeout(() => {
                    navigate('/admin');
                }, 1000);
            } else {
                // Handle 401 Unauthorized or 400 Bad Request
                toast.error("Access Denied", { description: data.message || "Invalid credentials." });
            }
        } catch (err) {
            // FIX 3: Catch network failures (Server down, CORS, Wrong Port)
            console.error("Login Fetch Error:", err);
            toast.error("Shields Up", {
                description: "Cannot connect to the Authentication Server."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8 bg-zinc-900/30 border border-zinc-800 p-12 rounded-[3rem] backdrop-blur-md">
                <div className="text-center space-y-4">
                    <div className="bg-emerald-500/10 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                        <ShieldCheck className="text-emerald-500" size={32} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-white uppercase">Vault Access</h1>
                    <p className="text-zinc-500 text-[10px] font-mono tracking-[0.3em] uppercase opacity-60">Admin Authorization Required</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Username"
                            autoComplete="username"
                            required
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 px-6 text-white outline-none focus:border-emerald-500/50 transition-all font-mono text-sm"
                            onChange={(e) => setCreds({ ...creds, username: e.target.value })}
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Keyphrase"
                            autoComplete="current-password"
                            required
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 px-6 text-white outline-none focus:border-emerald-500/50 transition-all font-mono text-sm"
                            onChange={(e) => setCreds({ ...creds, password: e.target.value })}
                        />
                    </div>
                    <button
                        disabled={loading}
                        className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Lock size={18} />}
                        {loading ? "VERIFYING..." : "AUTHORIZE"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;