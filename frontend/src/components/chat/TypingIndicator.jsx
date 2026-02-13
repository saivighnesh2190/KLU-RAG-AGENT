import React from 'react';

const TypingIndicator = () => {
    return (
        <div className="flex items-center space-x-2 px-4 py-3">
            <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-primary-400 typing-dot" />
                <div className="w-2 h-2 rounded-full bg-primary-400 typing-dot" />
                <div className="w-2 h-2 rounded-full bg-primary-400 typing-dot" />
            </div>
            <span className="text-sm text-dark-400">KLU Agent is thinking...</span>
        </div>
    );
};

export default TypingIndicator;
