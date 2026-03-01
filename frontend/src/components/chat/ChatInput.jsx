import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatInput = ({ onSend, isLoading, disabled }) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
        }
    }, [message]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !isLoading && !disabled) {
            onSend(message.trim());
            setMessage('');
            // Reset height after send
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative z-20 w-full mb-6 relative">
            {/* Glow backing for input */}
            <div className="absolute inset-x-0 -top-8 bottom-0 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none rounded-b-2xl blur-md -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                className="max-w-4xl mx-auto glass-glow rounded-2xl shadow-lg border-slate-200/80 p-2"
            >
                <div className="relative flex items-end space-x-3 bg-white/50 rounded-xl p-1 shadow-inner border border-slate-100">
                    {/* Input area */}
                    <div className="flex-1 relative">
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask anything about the campus..."
                            disabled={isLoading || disabled}
                            rows={1}
                            className="w-full px-4 py-3.5 pr-14 rounded-xl bg-transparent border-none text-slate-700 placeholder-slate-400 resize-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[15px] font-medium leading-relaxed"
                            style={{ boxShadow: 'none' }}
                        />

                        {/* Character count hint */}
                        {message.length > 500 && (
                            <span className="absolute right-3 bottom-3 text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                {message.length}/2000
                            </span>
                        )}
                    </div>

                    {/* Send button */}
                    <div className="pb-1 pr-1">
                        <motion.button
                            type="submit"
                            whileHover={!(isLoading || disabled || !message.trim()) ? { scale: 1.05 } : {}}
                            whileTap={!(isLoading || disabled || !message.trim()) ? { scale: 0.95 } : {}}
                            disabled={!message.trim() || isLoading || disabled}
                            className={`flex-shrink-0 p-3 rounded-xl transition-all shadow-md ${!message.trim() || isLoading || disabled
                                    ? 'bg-slate-100 text-slate-400 shadow-none border border-slate-200'
                                    : 'bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white shadow-primary-500/30 glow-primary-hover border border-primary-400/50'
                                }`}
                            title="Send message"
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <Send size={20} className={!message.trim() ? "opacity-50" : ""} />
                            )}
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Helper text */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-[11px] font-medium text-slate-400 mt-2.5 text-center tracking-wide uppercase"
            >
                Press <span className="text-slate-500 bg-white shadow-sm border border-slate-200 px-1.5 py-0.5 rounded">Enter</span> to send, <span className="text-slate-500 bg-white shadow-sm border border-slate-200 px-1.5 py-0.5 rounded">Shift+Enter</span> for new line
            </motion.p>
        </form>
    );
};

export default ChatInput;
