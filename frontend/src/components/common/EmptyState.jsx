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
                className="mb-8"
            >
                <img
                    src="/klu-logo.svg"
                    alt="KLU Agent"
                    className="w-24 h-24 mx-auto mb-6 animate-pulse-slow"
                />
                <h2 className="text-3xl font-bold gradient-text mb-3">
                    Welcome to KLU Agent
                </h2>
                <p className="text-dark-400 text-lg max-w-md">
                    Your AI assistant for all KL University queries. Ask me about courses,
                    placements, policies, events, and more!
                </p>
            </motion.div>

            {/* Suggestion chips */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-2xl"
            >
                <p className="text-dark-400 text-sm mb-4">Try asking:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SUGGESTION_CHIPS.map((chip, index) => (
                        <motion.button
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            onClick={() => onSuggestionClick(chip.text)}
                            className="flex items-center space-x-3 p-4 rounded-xl glass-light hover:bg-dark-700 text-left transition-all group card-hover"
                        >
                            <span className="text-2xl">{chip.icon}</span>
                            <span className="text-dark-200 group-hover:text-white text-sm">
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
                className="mt-12 flex flex-wrap justify-center gap-4 text-xs text-dark-500"
            >
                <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-primary-400"></span>
                    <span>Document Knowledge Base</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    <span>Live Database Queries</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    <span>AI-Powered Responses</span>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EmptyState;
