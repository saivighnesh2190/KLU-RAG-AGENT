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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
        >
            <div
                className={`flex items-start space-x-3 max-w-[85%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
            >
                {/* Avatar */}
                <motion.div
                    whileHover={{ scale: 1.1, rotate: isUser ? -10 : 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md ${isUser
                        ? 'bg-gradient-to-br from-primary-500 to-primary-600'
                        : 'bg-white border border-slate-200 shadow-sm'
                        }`}
                >
                    {isUser ? (
                        <User size={16} className="text-white" />
                    ) : (
                        <Bot size={18} className="text-primary-500" />
                    )}
                </motion.div>

                {/* Message content */}
                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                        className={`rounded-2xl px-5 py-4 shadow-sm font-medium ${isUser
                            ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-tr-sm shadow-primary-500/20'
                            : 'bg-white border border-slate-200/60 rounded-tl-sm shadow-slate-200/50'
                            }`}
                    >
                        {isUser ? (
                            <p className="text-[15px] whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        ) : (
                            <div className="prose prose-slate prose-sm max-w-none prose-p:leading-relaxed prose-pre:my-2 prose-pre:bg-slate-50 prose-pre:border prose-pre:border-slate-200">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        // Custom rendering for code blocks
                                        code({ node, inline, className, children, ...props }) {
                                            return inline ? (
                                                <code
                                                    className="bg-slate-100 px-1.5 py-0.5 rounded-md text-primary-700 text-[13px] border border-slate-200/60 font-medium"
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            ) : (
                                                <pre className="bg-slate-50 rounded-xl p-4 overflow-x-auto shadow-inner border border-slate-200/80">
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
                                                    className="text-primary-600 hover:text-primary-700 underline font-semibold transition-colors"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                />
                                            );
                                        },
                                        // Custom tables
                                        table({ node, ...props }) {
                                            return (
                                                <div className="overflow-x-auto my-3 rounded-lg border border-slate-200 shadow-sm bg-white">
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
                        <div className="mt-2 pl-1 w-full flex flex-col items-start">
                            <SourceCard sources={message.sources} />

                            <div className="flex items-center space-x-3 mt-2 text-xs text-slate-400 font-medium">
                                {message.response_time && (
                                    <div className="flex items-center space-x-1.5 bg-white/60 px-2 py-1 rounded-md border border-slate-200/50">
                                        <Zap size={12} className="text-amber-500 fill-amber-500/20" />
                                        <span>{formatResponseTime(message.response_time)}</span>
                                    </div>
                                )}

                                <button
                                    onClick={handleCopy}
                                    className="flex items-center space-x-1.5 hover:text-slate-600 transition-colors bg-white/60 px-2 py-1 rounded-md border border-slate-200/50 hover:bg-slate-50"
                                    title="Copy response"
                                >
                                    {copied ? (
                                        <>
                                            <Check size={12} className="text-emerald-500" />
                                            <span className="text-emerald-600">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={12} />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MessageBubble;
