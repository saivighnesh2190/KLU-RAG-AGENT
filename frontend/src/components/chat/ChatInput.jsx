import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

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
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="sticky bottom-0 p-4 glass border-t border-dark-700">
            <div className="max-w-4xl mx-auto">
                <div className="relative flex items-end space-x-3">
                    {/* Input area */}
                    <div className="flex-1 relative">
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask anything about KLU..."
                            disabled={isLoading || disabled}
                            rows={1}
                            className="w-full px-4 py-3 pr-12 rounded-xl bg-dark-800 border border-dark-600 text-white placeholder-dark-400 resize-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        />

                        {/* Character count hint */}
                        {message.length > 500 && (
                            <span className="absolute right-14 bottom-3 text-xs text-dark-500">
                                {message.length}/2000
                            </span>
                        )}
                    </div>

                    {/* Send button */}
                    <button
                        type="submit"
                        disabled={!message.trim() || isLoading || disabled}
                        className="flex-shrink-0 p-3 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:bg-dark-700 disabled:text-dark-500 text-white transition-all glow-hover disabled:shadow-none"
                        title="Send message"
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <Send size={20} />
                        )}
                    </button>
                </div>

                {/* Helper text */}
                <p className="text-xs text-dark-500 mt-2 text-center">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </div>
        </form>
    );
};

export default ChatInput;
