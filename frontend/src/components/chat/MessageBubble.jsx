import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, User, Bot, Zap } from 'lucide-react';
import SourceCard from './SourceCard';
import { copyToClipboard, formatResponseTime } from '../../utils/helpers';
import { MESSAGE_ROLES } from '../../utils/constants';

const MessageBubble = ({ message, isLast }) => {
    const [copied, setCopied] = useState(false);
    const isUser = message.role === MESSAGE_ROLES.USER;

    const handleCopy = async () => {
        const success = await copyToClipboard(message.content);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
        >
            <div
                className={`flex items-start space-x-3 max-w-[85%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
            >
                {/* Avatar */}
                <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser
                            ? 'bg-primary-500'
                            : 'bg-gradient-to-br from-primary-500 to-purple-500'
                        }`}
                >
                    {isUser ? (
                        <User size={16} className="text-white" />
                    ) : (
                        <Bot size={16} className="text-white" />
                    )}
                </div>

                {/* Message content */}
                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                        className={`rounded-2xl px-4 py-3 ${isUser
                                ? 'bg-primary-500 text-white rounded-tr-sm'
                                : 'glass rounded-tl-sm'
                            }`}
                    >
                        {isUser ? (
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        ) : (
                            <div className="prose prose-sm max-w-none text-dark-100">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        // Custom rendering for code blocks
                                        code({ node, inline, className, children, ...props }) {
                                            return inline ? (
                                                <code
                                                    className="bg-dark-800 px-1.5 py-0.5 rounded text-primary-300 text-xs"
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            ) : (
                                                <pre className="bg-dark-900 rounded-lg p-3 overflow-x-auto">
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                </pre>
                                            );
                                        },
                                        // Custom links
                                        a({ node, ...props }) {
                                            return (
                                                <a
                                                    {...props}
                                                    className="text-primary-400 hover:text-primary-300 underline"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                />
                                            );
                                        },
                                        // Custom tables
                                        table({ node, ...props }) {
                                            return (
                                                <div className="overflow-x-auto my-2">
                                                    <table className="min-w-full" {...props} />
                                                </div>
                                            );
                                        },
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>

                    {/* Sources and metadata for assistant messages */}
                    {!isUser && (
                        <>
                            <SourceCard sources={message.sources} />

                            <div className="flex items-center space-x-3 mt-2 text-xs text-dark-500">
                                {message.response_time && (
                                    <div className="flex items-center space-x-1">
                                        <Zap size={12} className="text-yellow-400" />
                                        <span>{formatResponseTime(message.response_time)}</span>
                                    </div>
                                )}

                                <button
                                    onClick={handleCopy}
                                    className="flex items-center space-x-1 hover:text-dark-300 transition-colors"
                                    title="Copy response"
                                >
                                    {copied ? (
                                        <>
                                            <Check size={12} className="text-green-400" />
                                            <span className="text-green-400">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={12} />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MessageBubble;
