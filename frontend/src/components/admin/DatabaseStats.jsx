import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    GraduationCap,
    BookOpen,
    Calendar,
    Building2,
    ClipboardList,
    Warehouse,
    RefreshCw
} from 'lucide-react';
import { adminAPI } from '../../api/axios';
import LoadingSpinner from '../common/LoadingSpinner';

const tableIcons = {
    students: Users,
    faculty: GraduationCap,
    courses: BookOpen,
    events: Calendar,
    departments: Building2,
    admissions: ClipboardList,
    facilities: Warehouse,
};

const tableColors = {
    students: 'from-blue-500 to-cyan-500',
    faculty: 'from-purple-500 to-pink-500',
    courses: 'from-emerald-500 to-teal-500',
    events: 'from-orange-500 to-amber-500',
    departments: 'from-indigo-500 to-violet-500',
    admissions: 'from-rose-500 to-red-500',
    facilities: 'from-cyan-500 to-blue-600',
};

const DatabaseStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await adminAPI.getDbStats();
            setStats(response.data);
        } catch (err) {
            setError('Failed to load database statistics');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16 px-4 rounded-xl border border-red-100 bg-red-50/50">
                <p className="text-red-600 font-bold mb-4">{error}</p>
                <button
                    onClick={fetchStats}
                    className="btn-primary inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/30"
                >
                    <RefreshCw size={16} />
                    <span>Retry</span>
                </button>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="space-y-8">
            {/* Total summary */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-slate-200/60 shadow-sm text-center relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 group-hover:opacity-70 transition-opacity duration-700"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 group-hover:opacity-70 transition-opacity duration-700"></div>

                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 relative z-10">Total Database Records</h3>
                <p className="text-6xl font-extrabold bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 bg-clip-text text-transparent relative z-10 tracking-tight">
                    {stats?.total_rows?.toLocaleString() || 0}
                </p>
                <button
                    onClick={fetchStats}
                    className="mt-6 text-sm font-semibold text-slate-400 hover:text-primary-600 inline-flex items-center space-x-1.5 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm hover:shadow relative z-10"
                >
                    <RefreshCw size={14} />
                    <span>Refresh Statistics</span>
                </button>
            </motion.div>

            {/* Table stats grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
                {stats?.tables?.map((table) => {
                    const Icon = tableIcons[table.table_name] || BookOpen;
                    const gradient = tableColors[table.table_name] || 'from-slate-400 to-slate-500';

                    return (
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ y: -5, scale: 1.02 }}
                            key={table.table_name}
                            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                        >
                            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${gradient} rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>

                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-inner text-white`}>
                                    <Icon size={22} strokeWidth={2.5} />
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Records</p>
                                </div>
                            </div>

                            <div className="relative z-10">
                                <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                                    {table.row_count.toLocaleString()}
                                </p>
                                <p className="text-slate-600 font-semibold text-sm capitalize mt-1">
                                    {table.table_name.replace('_', ' ')}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default DatabaseStats;
