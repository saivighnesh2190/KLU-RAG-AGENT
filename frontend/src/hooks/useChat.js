import { useState, useCallback, useEffect } from 'react';
import { chatAPI } from '../api/axios';
import { generateId, parseErrorMessage, storage } from '../utils/helpers';
import { STORAGE_KEYS, MESSAGE_ROLES } from '../utils/constants';
import toast from 'react-hot-toast';

/**
 * Custom hook for chat functionality
 * Can be used standalone without context
 */
const useChat = () => {
    const [messages, setMessages] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(
        storage.get(STORAGE_KEYS.CURRENT_SESSION)
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch sessions on mount
    useEffect(() => {
        fetchSessions();
    }, []);

    // Send message
    const sendMessage = useCallback(async (content) => {
        if (!content.trim() || isLoading) return;

        setError(null);

        const userMessage = {
            id: generateId(),
            role: MESSAGE_ROLES.USER,
            content: content.trim(),
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await chatAPI.sendMessage(content, currentSessionId);
            const data = response.data;

            if (data.session_id && data.session_id !== currentSessionId) {
                setCurrentSessionId(data.session_id);
                storage.set(STORAGE_KEYS.CURRENT_SESSION, data.session_id);
            }

            const assistantMessage = {
                id: generateId(),
                role: MESSAGE_ROLES.ASSISTANT,
                content: data.answer,
                sources: data.sources,
                response_time: data.response_time,
                timestamp: data.timestamp,
            };

            setMessages(prev => [...prev, assistantMessage]);
            fetchSessions();

        } catch (err) {
            const errorMessage = parseErrorMessage(err);
            setError(errorMessage);
            toast.error(errorMessage);

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

    const startNewChat = useCallback(() => {
        setMessages([]);
        setCurrentSessionId(null);
        storage.remove(STORAGE_KEYS.CURRENT_SESSION);
        setError(null);
    }, []);

    const loadSession = useCallback(async (sessionId) => {
        if (sessionId === currentSessionId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await chatAPI.getHistory(sessionId);
            const data = response.data;

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
        } finally {
            setIsLoading(false);
        }
    }, [currentSessionId]);

    const deleteSession = useCallback(async (sessionId) => {
        try {
            await chatAPI.clearHistory(sessionId);

            if (sessionId === currentSessionId) {
                startNewChat();
            }

            fetchSessions();
            toast.success('Chat deleted');

        } catch (err) {
            toast.error('Failed to delete chat');
        }
    }, [currentSessionId, startNewChat]);

    const fetchSessions = useCallback(async () => {
        try {
            const response = await chatAPI.getSessions();
            setSessions(response.data || []);
        } catch (err) {
            console.error('Failed to fetch sessions:', err);
        }
    }, []);

    return {
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
};

export default useChat;
