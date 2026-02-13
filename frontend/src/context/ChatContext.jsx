import React, { createContext, useContext, useState, useCallback } from 'react';
import { chatAPI } from '../api/axios';
import { generateId, parseErrorMessage, storage } from '../utils/helpers';
import { STORAGE_KEYS, MESSAGE_ROLES } from '../utils/constants';
import toast from 'react-hot-toast';

const ChatContext = createContext(null);

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    // State
    const [messages, setMessages] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(
        storage.get(STORAGE_KEYS.CURRENT_SESSION)
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Send a message
    const sendMessage = useCallback(async (content) => {
        if (!content.trim() || isLoading) return;

        setError(null);

        // Create user message
        const userMessage = {
            id: generateId(),
            role: MESSAGE_ROLES.USER,
            content: content.trim(),
            timestamp: new Date().toISOString(),
        };

        // Add user message to state immediately
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Send to API
            const response = await chatAPI.sendMessage(content, currentSessionId);
            const data = response.data;

            // Update session ID if new
            if (data.session_id && data.session_id !== currentSessionId) {
                setCurrentSessionId(data.session_id);
                storage.set(STORAGE_KEYS.CURRENT_SESSION, data.session_id);
            }

            // Create assistant message
            const assistantMessage = {
                id: generateId(),
                role: MESSAGE_ROLES.ASSISTANT,
                content: data.answer,
                sources: data.sources,
                response_time: data.response_time,
                timestamp: data.timestamp,
            };

            // Add assistant message to state
            setMessages(prev => [...prev, assistantMessage]);

            // Refresh sessions list
            fetchSessions();

        } catch (err) {
            const errorMessage = parseErrorMessage(err);
            setError(errorMessage);
            toast.error(errorMessage);

            // Add error message
            setMessages(prev => [...prev, {
                id: generateId(),
                role: MESSAGE_ROLES.ASSISTANT,
                content: `⚠️ Error: ${errorMessage}. Please try again.`,
                sources: [],
                timestamp: new Date().toISOString(),
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [currentSessionId, isLoading]);

    // Start new chat
    const startNewChat = useCallback(() => {
        setMessages([]);
        setCurrentSessionId(null);
        storage.remove(STORAGE_KEYS.CURRENT_SESSION);
        setError(null);
    }, []);

    // Load session history
    const loadSession = useCallback(async (sessionId) => {
        if (sessionId === currentSessionId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await chatAPI.getHistory(sessionId);
            const data = response.data;

            // Transform messages to our format
            const loadedMessages = (data.messages || []).map(msg => ({
                id: generateId(),
                role: msg.role,
                content: msg.content,
                sources: msg.sources || [],
                timestamp: msg.timestamp,
            }));

            setMessages(loadedMessages);
            setCurrentSessionId(sessionId);
            storage.set(STORAGE_KEYS.CURRENT_SESSION, sessionId);

        } catch (err) {
            toast.error('Failed to load chat history');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [currentSessionId]);

    // Delete session
    const deleteSession = useCallback(async (sessionId) => {
        try {
            await chatAPI.clearHistory(sessionId);

            // If deleting current session, start new chat
            if (sessionId === currentSessionId) {
                startNewChat();
            }

            // Refresh sessions
            fetchSessions();
            toast.success('Chat deleted');

        } catch (err) {
            toast.error('Failed to delete chat');
            console.error(err);
        }
    }, [currentSessionId, startNewChat]);

    // Fetch sessions list
    const fetchSessions = useCallback(async () => {
        try {
            const response = await chatAPI.getSessions();
            setSessions(response.data || []);
        } catch (err) {
            console.error('Failed to fetch sessions:', err);
        }
    }, []);

    // Context value
    const value = {
        messages,
        sessions,
        currentSessionId,
        isLoading,
        error,
        sendMessage,
        startNewChat,
        loadSession,
        deleteSession,
        fetchSessions,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export default ChatContext;
