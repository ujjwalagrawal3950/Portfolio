import React, { useEffect, useState } from 'react';
import { Trash2, User, Fingerprint, RefreshCcw, Search, Database, XCircle } from 'lucide-react';
import { toast } from 'sonner'; // Assuming you are using sonner for notifications

const API_BASE_URL = 'http://localhost:5000/api';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // 1. Fetch Users with Credentials
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/users`, {
                // REQUIRED: Sends the JWT cookie to verify you are the admin
                credentials: 'include'
            });
            const data = await res.json();

            if (res.ok) {
                setUsers(data);
            } else if (res.status === 401) {
                toast.error("Unauthorized", { description: "Redirecting to login..." });
                window.location.href = '/admin/login';
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            toast.error("Connection Error", { description: "Could not sync with registry." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 2. Delete Handler with Credentials
    const deleteUser = async (id) => {
        if (!window.confirm("PERMANENT PURGE: Are you sure you want to delete this node?")) return;

        try {
            const res = await fetch(`${API_BASE_URL}/admin/user/${id}`, {
                method: 'DELETE',
                // FIX: Added credentials to pass the protectAdmin middleware
                credentials: 'include',
            });

            if (res.ok) {
                setUsers(users.filter(user => user._id !== id));
                toast.success("Node Purged", { description: "Identity removed from system registry." });
            } else {
                const errorData = await res.json();
                toast.error("Purge Failed", { description: errorData.message || "Access denied." });
            }
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("System Error", { description: "Could not complete the purge command." });
        }
    };

    // Filter Logic (Search by Name or ID)
    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user._id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-12 pt-24 font-sans selection:bg-emerald-100">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                            <Database size={14} />
                            <span>System Registry</span>
                        </div>
                        <h1 className="text-5xl font-black text-zinc-900 tracking-tighter italic">ORBIT_CONTROL</h1>
                        <p className="text-zinc-500 text-lg font-medium">Manage and monitor active nodes within the network.</p>
                    </div>

                    {/* Stats & Refresh */}
                    <div className="flex items-center gap-4">
                        <div className="bg-white border border-zinc-200 px-6 py-3 rounded-2xl shadow-sm">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter leading-none mb-1">Total Nodes</p>
                            <p className="text-xl font-black text-zinc-900 leading-none">{users.length}</p>
                        </div>
                        <button
                            onClick={fetchUsers}
                            className="p-4 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-2xl transition-all shadow-sm group active:scale-95"
                        >
                            <RefreshCcw size={20} className={`${loading ? "animate-spin" : ""} text-zinc-500 group-hover:text-zinc-900`} />
                        </button>
                    </div>
                </div>

                {/* Search Bar Section */}
                <div className="relative mb-8">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or unique ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-6 py-5 bg-white border border-zinc-200 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all text-zinc-700 placeholder:text-zinc-300"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500"
                        >
                            <XCircle size={20} />
                        </button>
                    )}
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-[3rem] border border-zinc-200 overflow-hidden shadow-xl shadow-zinc-200/50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50/50 border-b border-zinc-100">
                                    <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Node Signature (ID)</th>
                                    <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Operator Details</th>
                                    <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Terminal Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-zinc-50/50 transition-colors group">
                                        <td className="p-8">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-zinc-100 rounded-2xl text-zinc-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                                                    <Fingerprint size={22} />
                                                </div>
                                                <code className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-lg">
                                                    {user._id}
                                                </code>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-5">
                                                <div className="relative">
                                                    <img
                                                        src={user.imageUrl || 'https://via.placeholder.com/150'}
                                                        alt={user.name}
                                                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md grayscale group-hover:grayscale-0 transition-all duration-500"
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
                                                </div>
                                                <div>
                                                    <span className="block font-black text-zinc-900 text-lg leading-none mb-1">{user.name}</span>
                                                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">Authorized Personnel</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8 text-right">
                                            <button
                                                onClick={() => deleteUser(user._id)}
                                                className="p-4 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                                                title="Delete Node"
                                            >
                                                <Trash2 size={22} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty Search Result */}
                    {filteredUsers.length === 0 && !loading && (
                        <div className="p-24 text-center">
                            <div className="bg-zinc-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-100">
                                <User className="text-zinc-200" size={40} />
                            </div>
                            <h3 className="text-xl font-black text-zinc-900 tracking-tight">NO_NODES_FOUND</h3>
                            <p className="text-zinc-400 mt-1 font-medium italic text-sm">Adjust your search parameters or registry filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUserList;