import React from 'react';
import { motion } from 'framer-motion';
import { SUGGESTION_CHIPS } from '../../utils/constants';

const EmptyState = ({ onSuggestionClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center"
        >
            {/* Logo and welcome text */}
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-10"
            >
                <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-primary-100 rounded-full blur-2xl opacity-60 animate-pulse-slow"></div>
                    <img
                        src="/klu-logo.svg"
                        alt="KLU Agent"
                        className="w-full h-full object-contain relative z-10 drop-shadow-sm"
                    />
                </div>
                <h2 className="text-4xl font-extrabold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4 tracking-tight">
                    Welcome to KLU Agent
                </h2>
                <p className="text-slate-500 text-lg max-w-md font-medium leading-relaxed">
                    Your AI assistant for all KL University queries. Ask me about courses,
                    placements, policies, events, and more!
                </p>
            </motion.div>

            {/* Suggestion chips */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-2xl w-full"
            >
                <p className="text-slate-400 font-semibold text-sm mb-5 uppercase tracking-wider">Try asking</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {SUGGESTION_CHIPS.map((chip, index) => (
                        <motion.button
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1, type: "spring", stiffness: 300 }}
                            whileHover={{ y: -3, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSuggestionClick(chip.text)}
                            className="flex items-center space-x-4 p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 text-left transition-all group overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all relative z-10">
                                <span className="text-2xl drop-shadow-sm">{chip.icon}</span>
                            </div>
                            <span className="text-slate-600 font-semibold group-hover:text-primary-700 text-sm leading-snug relative z-10 transition-colors">
                                {chip.text}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Features hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-14 flex flex-wrap justify-center gap-6 text-xs font-bold text-slate-400 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border border-slate-200 shadow-sm"
            >
                <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50"></span>
                    <span>Document Knowledge Base</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
                    <span>Live Database Queries</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400/50"></span>
                    <span>AI-Powered Responses</span>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EmptyState;
