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
    courses: 'from-green-500 to-emerald-500',
    events: 'from-orange-500 to-amber-500',
    departments: 'from-indigo-500 to-violet-500',
    admissions: 'from-rose-500 to-red-500',
    facilities: 'from-teal-500 to-cyan-500',
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
            <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                    onClick={fetchStats}
                    className="btn-primary inline-flex items-center space-x-2"
                >
                    <RefreshCw size={16} />
                    <span>Retry</span>
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Total summary */}
            <div className="glass rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Total Database Records</h3>
                <p className="text-4xl font-bold gradient-text">{stats?.total_rows || 0}</p>
                <button
                    onClick={fetchStats}
                    className="mt-4 text-sm text-dark-400 hover:text-white inline-flex items-center space-x-1"
                >
                    <RefreshCw size={14} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Table stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {stats?.tables?.map((table, index) => {
                    const Icon = tableIcons[table.table_name] || BookOpen;
                    const gradient = tableColors[table.table_name] || 'from-gray-500 to-slate-500';

                    return (
                        <motion.div
                            key={table.table_name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass rounded-xl p-4 card-hover"
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`p-3 rounded-lg bg-gradient-to-br ${gradient}`}>
                                    <Icon size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-dark-300 text-sm capitalize">
                                        {table.table_name.replace('_', ' ')}
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {table.row_count}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default DatabaseStats;
