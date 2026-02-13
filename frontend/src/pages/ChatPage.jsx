import React, { useState, useEffect } from 'react';
import ChatWindow from '../components/chat/ChatWindow';
import ChatInput from '../components/chat/ChatInput';
import Sidebar from '../components/layout/Sidebar';
import useChat from '../hooks/useChat';

const ChatPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const {
        messages,
        sessions,
        currentSessionId,
        isLoading,
        sendMessage,
        startNewChat,
        loadSession,
        deleteSession,
        fetchSessions,
    } = useChat();

    // Fetch sessions on mount
    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    const handleSuggestionClick = (suggestion) => {
        sendMessage(suggestion);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={toggleSidebar}
                sessions={sessions}
                currentSessionId={currentSessionId}
                onNewChat={startNewChat}
                onSelectSession={loadSession}
                onDeleteSession={deleteSession}
            />

            {/* Main chat area */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-72' : ''
                    }`}
            >
                {/* Chat window */}
                <ChatWindow
                    messages={messages}
                    isLoading={isLoading}
                    onSuggestionClick={handleSuggestionClick}
                />

                {/* Chat input */}
                <ChatInput
                    onSend={sendMessage}
                    isLoading={isLoading}
                    disabled={false}
                />
            </div>
        </div>
    );
};

export default ChatPage;
