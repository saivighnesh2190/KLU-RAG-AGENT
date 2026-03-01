import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Database,
    Server,
    RefreshCw,
    Trash2,
    Clock,
    Cpu,
    HardDrive
} from 'lucide-react';
import DocumentUpload from '../components/admin/DocumentUpload';
import DatabaseStats from '../components/admin/DatabaseStats';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useDocuments from '../hooks/useDocuments';
import { adminAPI } from '../api/axios';
import { formatFileSize, formatRelativeTime } from '../utils/helpers';
import toast from 'react-hot-toast';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('documents');
    const [systemInfo, setSystemInfo] = useState(null);
    const [loadingSystem, setLoadingSystem] = useState(true);

    const {
        documents,
        stats,
        isLoading,
        fetchDocuments,
        fetchStats,
        deleteDocument
    } = useDocuments();

    // Fetch system info
    useEffect(() => {
        const fetchSystemInfo = async () => {
            try {
                const response = await adminAPI.getSystemInfo();
                setSystemInfo(response.data);
            } catch (err) {
                console.error('Failed to fetch system info:', err);
            } finally {
                setLoadingSystem(false);
            }
        };

        fetchSystemInfo();
    }, []);

    const handleRefresh = () => {
        fetchDocuments();
        fetchStats();
        toast.success('Data refreshed');
    };

    const tabs = [
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'database', label: 'Database', icon: Database },
        { id: 'system', label: 'System', icon: Server },
    ];

    const tabVariants = {
        hidden: { opacity: 0, y: 15, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
        exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 p-6 overflow-auto bg-slate-50 relative z-10"
        >
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Admin Panel</h1>
                        <p className="text-slate-500 mt-1.5 font-medium">
                            Manage documents, view statistics, and monitor system health
                        </p>
                    </motion.div>
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleRefresh}
                        className="mt-4 sm:mt-0 btn-primary inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 shadow-primary-500/30 glow-primary-hover"
                    >
                        <RefreshCw size={16} />
                        <span>Refresh Data</span>
                    </motion.button>
                </div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex space-x-1 mb-8 p-1.5 bg-white/60 backdrop-blur-md rounded-xl w-fit shadow-sm border border-slate-200/60"
                >
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 relative ${activeTab === id
                                ? 'text-primary-600'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                                }`}
                        >
                            <Icon size={16} className={activeTab === id ? 'text-primary-500' : ''} />
                            <span className="relative z-10">{label}</span>
                            {activeTab === id && (
                                <motion.div
                                    layoutId="activeAdminTab"
                                    className="absolute inset-0 bg-primary-50 rounded-lg border border-primary-100 shadow-sm"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </motion.div>

                {/* Tab content */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            variants={tabVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {/* Documents Tab */}
                            {activeTab === 'documents' && (
                                <div className="space-y-6">
                                    {/* Upload section */}
                                    <div className="glass-light rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80">
                                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                                                <FileText size={16} className="text-primary-600" />
                                            </div>
                                            Upload Documents
                                        </h2>
                                        <DocumentUpload onUploadSuccess={handleRefresh} />
                                    </div>

                                    {/* Documents list */}
                                    <div className="glass-light rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-bold text-slate-800 flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                    <Database size={16} className="text-blue-600" />
                                                </div>
                                                Knowledge Base
                                            </h2>
                                            {stats && (
                                                <span className="text-sm font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
                                                    {stats.total_documents} docs · {stats.total_chunks} chunks
                                                </span>
                                            )}
                                        </div>

                                        {isLoading ? (
                                            <LoadingSpinner className="py-8" />
                                        ) : documents.length === 0 ? (
                                            <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                                                <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                                                <p className="text-lg font-semibold text-slate-600">No documents yet</p>
                                                <p className="text-slate-400 mt-1">Upload your first document above to get started.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {documents.map((doc, index) => (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        key={doc.id}
                                                        className="group flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 hover:border-primary-200 hover:shadow-md transition-all duration-300"
                                                    >
                                                        <div className="flex items-center space-x-4">
                                                            <div className="p-3 bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl text-primary-500 group-hover:from-primary-100 group-hover:to-blue-100 transition-colors">
                                                                <FileText size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="text-slate-800 font-bold mb-0.5">{doc.name}</p>
                                                                <div className="flex items-center space-x-3 text-xs font-medium text-slate-500">
                                                                    <span className="bg-slate-100 px-2 py-0.5 rounded">{formatFileSize(doc.size || 0)}</span>
                                                                    <span>·</span>
                                                                    <span className="text-primary-600 bg-primary-50 px-2 py-0.5 rounded">{doc.chunk_count} chunks</span>
                                                                    {doc.upload_date && (
                                                                        <>
                                                                            <span>·</span>
                                                                            <span className="flex items-center"><Clock size={10} className="mr-1 inline" /> {formatRelativeTime(doc.upload_date)}</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => deleteDocument(doc.id || doc.name)}
                                                            className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 border border-transparent hover:border-red-100 shadow-sm"
                                                            title="Delete document"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Database Tab */}
                            {activeTab === 'database' && (
                                <div className="glass-light rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80">
                                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                            <Database size={16} className="text-indigo-600" />
                                        </div>
                                        Database Statistics
                                    </h2>
                                    <DatabaseStats />
                                </div>
                            )}

                            {/* System Tab */}
                            {activeTab === 'system' && (
                                <div className="space-y-6">
                                    {loadingSystem ? (
                                        <LoadingSpinner className="py-12" />
                                    ) : systemInfo ? (
                                        <>
                                            {/* System info cards */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <motion.div
                                                    whileHover={{ y: -5 }}
                                                    className="glass-light rounded-2xl p-6 shadow-sm border border-slate-200/80 relative overflow-hidden group"
                                                >
                                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-100 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                                    <div className="flex items-center space-x-3 mb-4 relative z-10">
                                                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 border border-purple-200/50 shadow-inner">
                                                            <Cpu size={20} className="text-purple-600" />
                                                        </div>
                                                        <h3 className="font-bold text-slate-700">LLM Provider</h3>
                                                    </div>
                                                    <p className="text-3xl font-extrabold text-slate-800 capitalize tracking-tight relative z-10">
                                                        {systemInfo.llm_provider}
                                                    </p>
                                                    <p className="text-slate-500 font-medium text-sm mt-2 relative z-10 bg-white/60 inline-block px-2 py-1 rounded-md border border-slate-100">
                                                        Model: <span className="text-slate-700 font-semibold">{systemInfo.llm_model}</span>
                                                    </p>
                                                </motion.div>

                                                <motion.div
                                                    whileHover={{ y: -5 }}
                                                    className="glass-light rounded-2xl p-6 shadow-sm border border-slate-200/80 relative overflow-hidden group"
                                                >
                                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                                    <div className="flex items-center space-x-3 mb-4 relative z-10">
                                                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 border border-blue-200/50 shadow-inner">
                                                            <HardDrive size={20} className="text-blue-600" />
                                                        </div>
                                                        <h3 className="font-bold text-slate-700">Embedding Model</h3>
                                                    </div>
                                                    <p className="text-xl font-bold text-slate-800 relative z-10 mt-2 truncate w-full" title={systemInfo.embedding_model}>
                                                        {systemInfo.embedding_model}
                                                    </p>
                                                </motion.div>

                                                <motion.div
                                                    whileHover={{ y: -5 }}
                                                    className="glass-light rounded-2xl p-6 shadow-sm border border-slate-200/80 relative overflow-hidden group"
                                                >
                                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-100 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                                    <div className="flex items-center space-x-3 mb-4 relative z-10">
                                                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200/50 shadow-inner">
                                                            <Clock size={20} className="text-green-600" />
                                                        </div>
                                                        <h3 className="font-bold text-slate-700">System Uptime</h3>
                                                    </div>
                                                    <p className="text-3xl font-extrabold text-slate-800 tracking-tight relative z-10">
                                                        {Math.floor(systemInfo.uptime_seconds / 60)} <span className="text-xl text-slate-500 font-semibold">min</span>
                                                    </p>
                                                    <p className="text-slate-500 font-medium text-sm mt-2 relative z-10">
                                                        {Math.round(systemInfo.uptime_seconds)} seconds total
                                                    </p>
                                                </motion.div>
                                            </div>

                                            {/* Vector store info */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 }}
                                                className="glass-light rounded-2xl p-8 shadow-sm border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
                                                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center relative z-10">
                                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                                                        <Database size={16} className="text-amber-600" />
                                                    </div>
                                                    Vector Database Stats
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                                                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                                                        <div>
                                                            <p className="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-1">Total Documents</p>
                                                            <p className="text-3xl font-extrabold text-slate-800">
                                                                {systemInfo.vector_store_documents}
                                                            </p>
                                                        </div>
                                                        <div className="p-4 bg-slate-50 rounded-full text-slate-400">
                                                            <FileText size={24} />
                                                        </div>
                                                    </div>
                                                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                                                        <div>
                                                            <p className="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-1">Total Chunks Indexed</p>
                                                            <p className="text-3xl font-extrabold text-primary-600">
                                                                {systemInfo.vector_store_chunks}
                                                            </p>
                                                        </div>
                                                        <div className="p-4 bg-primary-50 rounded-full text-primary-400">
                                                            <Database size={24} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </>
                                    ) : (
                                        <div className="text-center py-12 px-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                                            <Server size={48} className="mx-auto text-red-300 mb-4" />
                                            <p className="text-lg font-bold text-slate-800">Connection Failed</p>
                                            <p className="text-slate-500 mt-2">Could not retrieve system information from backend.</p>
                                            <button onClick={handleRefresh} className="mt-4 btn-secondary">Try Again</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminPage;
