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
    return (
        <>
            {/* Toggle button when closed */}
            {!isOpen && (
                <button
                    onClick={onToggle}
                    className="fixed left-4 top-20 z-40 p-2 rounded-lg glass hover:bg-dark-700 text-dark-300 hover:text-white transition-all"
                    title="Open sidebar"
                >
                    <ChevronRight size={20} />
                </button>
            )}

            {/* Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{ x: -280, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -280, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="fixed left-0 top-16 bottom-0 w-72 glass border-r border-dark-700 z-30 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-dark-700 flex items-center justify-between">
                            <button
                                onClick={onNewChat}
                                className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-all glow-hover"
                            >
                                <Plus size={18} />
                                <span>New Chat</span>
                            </button>
                            <button
                                onClick={onToggle}
                                className="ml-2 p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
                                title="Close sidebar"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        </div>

                        {/* Sessions list */}
                        <div className="flex-1 overflow-y-auto scrollbar-hide p-2">
                            {sessions.length === 0 ? (
                                <div className="text-center py-8 text-dark-400">
                                    <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No chat history yet</p>
                                    <p className="text-xs mt-1">Start a new conversation!</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {sessions.map((session) => (
                                        <motion.div
                                            key={session.session_id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`group relative rounded-lg transition-all cursor-pointer ${currentSessionId === session.session_id
                                                    ? 'bg-primary-500/20 border border-primary-500/30'
                                                    : 'hover:bg-dark-700 border border-transparent'
                                                }`}
                                        >
                                            <button
                                                onClick={() => onSelectSession(session.session_id)}
                                                className="w-full text-left p-3"
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <MessageSquare
                                                        size={16}
                                                        className={`mt-0.5 flex-shrink-0 ${currentSessionId === session.session_id
                                                                ? 'text-primary-400'
                                                                : 'text-dark-400'
                                                            }`}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium truncate ${currentSessionId === session.session_id
                                                                ? 'text-white'
                                                                : 'text-dark-200'
                                                            }`}>
                                                            {truncateText(session.title, 30)}
                                                        </p>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <Clock size={12} className="text-dark-500" />
                                                            <span className="text-xs text-dark-400">
                                                                {formatRelativeTime(session.last_message_at)}
                                                            </span>
                                                            <span className="text-xs text-dark-500">
                                                                · {session.message_count} msgs
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
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded opacity-0 group-hover:opacity-100 text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                title="Delete chat"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-dark-700">
                            <p className="text-xs text-dark-500 text-center">
                                KLU Agent v1.0.0
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
                        className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
