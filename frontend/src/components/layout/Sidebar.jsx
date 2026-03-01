import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    MessageSquare,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Clock
} from 'lucide-react';
import { formatRelativeTime, truncateText } from '../../utils/helpers';

const Sidebar = ({
    isOpen,
    onToggle,
    sessions,
    currentSessionId,
    onNewChat,
    onSelectSession,
    onDeleteSession
}) => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0, transition: { duration: 0.3 } }
    };

    return (
        <>
            {/* Toggle button when closed */}
            {!isOpen && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onToggle}
                    className="fixed left-4 top-20 z-40 p-2.5 rounded-xl glass-light hover:glass-glow text-slate-600 hover:text-primary-600 transition-all shadow-sm"
                    title="Open sidebar"
                >
                    <ChevronRight size={20} />
                </motion.button>
            )}

            {/* Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{ x: -320, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -320, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed left-0 top-16 bottom-0 w-80 glass border-r border-slate-200 z-30 flex flex-col shadow-xl"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-200/50 flex items-center justify-between bg-white/30">
                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(14, 165, 233, 0.3)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onNewChat}
                                className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md transition-colors"
                            >
                                <Plus size={18} />
                                <span>New Chat</span>
                            </motion.button>
                            <button
                                onClick={onToggle}
                                className="ml-3 p-2.5 rounded-xl text-slate-500 hover:text-primary-600 hover:bg-slate-100 transition-colors"
                                title="Close sidebar"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        </div>

                        {/* Sessions list */}
                        <div className="flex-1 overflow-y-auto scrollbar-hide p-3">
                            {(!sessions || sessions.length === 0) ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-10"
                                >
                                    <MessageSquare size={36} className="mx-auto mb-3 text-slate-400" />
                                    <p className="text-sm font-semibold text-slate-700">No chat history yet</p>
                                    <p className="text-xs mt-1 text-slate-500">Start a new conversation!</p>
                                </motion.div>
                            ) : (
                                <div className="space-y-1.5 flex flex-col">
                                    {sessions.map((session) => (
                                        <div
                                            key={session.session_id}
                                            className={`group relative rounded-xl transition-all cursor-pointer ${currentSessionId === session.session_id
                                                ? 'bg-white shadow-sm border border-primary-200 ring-1 ring-primary-500/10'
                                                : 'hover:bg-white/60 border border-transparent hover:border-slate-200/50'
                                                }`}
                                        >
                                            <button
                                                onClick={() => onSelectSession(session.session_id)}
                                                className="w-full text-left p-3.5"
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <MessageSquare
                                                        size={18}
                                                        className={`mt-0.5 flex-shrink-0 transition-colors ${currentSessionId === session.session_id
                                                            ? 'text-primary-500'
                                                            : 'text-slate-500 group-hover:text-primary-500'
                                                            }`}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-semibold truncate transition-colors ${currentSessionId === session.session_id
                                                            ? 'text-slate-900'
                                                            : 'text-slate-700 group-hover:text-slate-900'
                                                            }`}>
                                                            {truncateText(session.title, 32)}
                                                        </p>
                                                        <div className="flex items-center space-x-2 mt-1.5">
                                                            <Clock size={12} className="text-slate-400" />
                                                            <span className="text-xs text-slate-500 font-medium">
                                                                {formatRelativeTime(session.last_message_at)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>

                                            {/* Delete button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteSession(session.session_id);
                                                }}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                                                title="Delete chat"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-slate-200/50 bg-slate-50/50 backdrop-blur-sm">
                            <p className="text-xs font-semibold text-slate-400 text-center tracking-wider">
                                KLU AGENT V1.0
                            </p>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Overlay for mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onToggle}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 md:hidden"
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
