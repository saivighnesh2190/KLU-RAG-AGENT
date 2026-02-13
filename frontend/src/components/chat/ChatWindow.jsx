import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import EmptyState from '../common/EmptyState';
import { scrollToBottom } from '../../utils/helpers';

const ChatWindow = ({ messages, isLoading, onSuggestionClick }) => {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (containerRef.current) {
            scrollToBottom(containerRef.current);
        }
    }, [messages, isLoading]);

    // Show empty state if no messages
    if (messages.length === 0 && !isLoading) {
        return <EmptyState onSuggestionClick={onSuggestionClick} />;
    }

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
        >
            <div className="max-w-4xl mx-auto">
                {messages.map((message, index) => (
                    <MessageBubble
                        key={message.id || index}
                        message={message}
                        isLast={index === messages.length - 1}
                    />
                ))}

                {isLoading && (
                    <div className="flex justify-start mb-4">
                        <div className="glass rounded-2xl rounded-tl-sm">
                            <TypingIndicator />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ChatWindow;
