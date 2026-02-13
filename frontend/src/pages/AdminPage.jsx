import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

    return (
        <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                        <p className="text-dark-400 mt-1">
                            Manage documents, view statistics, and monitor system health
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="mt-4 sm:mt-0 btn-primary inline-flex items-center space-x-2"
                    >
                        <RefreshCw size={16} />
                        <span>Refresh</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 mb-6 p-1 bg-dark-800 rounded-lg w-fit">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === id
                                    ? 'bg-primary-500 text-white'
                                    : 'text-dark-300 hover:text-white hover:bg-dark-700'
                                }`}
                        >
                            <Icon size={16} />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Documents Tab */}
                    {activeTab === 'documents' && (
                        <div className="space-y-6">
                            {/* Upload section */}
                            <div className="glass rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-white mb-4">
                                    Upload Documents
                                </h2>
                                <DocumentUpload onUploadSuccess={handleRefresh} />
                            </div>

                            {/* Documents list */}
                            <div className="glass rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-white">
                                        Knowledge Base Documents
                                    </h2>
                                    {stats && (
                                        <span className="text-sm text-dark-400">
                                            {stats.total_documents} documents · {stats.total_chunks} chunks
                                        </span>
                                    )}
                                </div>

                                {isLoading ? (
                                    <LoadingSpinner className="py-8" />
                                ) : documents.length === 0 ? (
                                    <p className="text-center py-8 text-dark-400">
                                        No documents uploaded yet
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {documents.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="flex items-center justify-between p-4 rounded-lg bg-dark-800/50 border border-dark-700"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <FileText size={20} className="text-primary-400" />
                                                    <div>
                                                        <p className="text-white font-medium">{doc.name}</p>
                                                        <div className="flex items-center space-x-3 text-xs text-dark-400 mt-1">
                                                            <span>{formatFileSize(doc.size || 0)}</span>
                                                            <span>·</span>
                                                            <span>{doc.chunk_count} chunks</span>
                                                            {doc.upload_date && (
                                                                <>
                                                                    <span>·</span>
                                                                    <span>{formatRelativeTime(doc.upload_date)}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => deleteDocument(doc.id || doc.name)}
                                                    className="p-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                    title="Delete document"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Database Tab */}
                    {activeTab === 'database' && (
                        <div className="glass rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-6">
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="glass rounded-xl p-6">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="p-2 rounded-lg bg-purple-500/20">
                                                    <Cpu size={20} className="text-purple-400" />
                                                </div>
                                                <h3 className="font-semibold text-white">LLM Provider</h3>
                                            </div>
                                            <p className="text-2xl font-bold text-white capitalize">
                                                {systemInfo.llm_provider}
                                            </p>
                                            <p className="text-dark-400 text-sm mt-1">
                                                Model: {systemInfo.llm_model}
                                            </p>
                                        </div>

                                        <div className="glass rounded-xl p-6">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="p-2 rounded-lg bg-blue-500/20">
                                                    <HardDrive size={20} className="text-blue-400" />
                                                </div>
                                                <h3 className="font-semibold text-white">Embedding Model</h3>
                                            </div>
                                            <p className="text-lg font-bold text-white">
                                                {systemInfo.embedding_model}
                                            </p>
                                        </div>

                                        <div className="glass rounded-xl p-6">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="p-2 rounded-lg bg-green-500/20">
                                                    <Clock size={20} className="text-green-400" />
                                                </div>
                                                <h3 className="font-semibold text-white">Uptime</h3>
                                            </div>
                                            <p className="text-2xl font-bold text-white">
                                                {Math.floor(systemInfo.uptime_seconds / 60)} min
                                            </p>
                                            <p className="text-dark-400 text-sm mt-1">
                                                {Math.round(systemInfo.uptime_seconds)} seconds
                                            </p>
                                        </div>
                                    </div>

                                    {/* Vector store info */}
                                    <div className="glass rounded-xl p-6">
                                        <h3 className="font-semibold text-white mb-4">Vector Store</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-dark-400 text-sm">Documents</p>
                                                <p className="text-xl font-bold text-white">
                                                    {systemInfo.vector_store_documents}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-dark-400 text-sm">Chunks</p>
                                                <p className="text-xl font-bold text-white">
                                                    {systemInfo.vector_store_chunks}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-center py-8 text-dark-400">
                                    Failed to load system information
                                </p>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AdminPage;
