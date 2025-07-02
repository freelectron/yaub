"use client";
import React, { useState } from 'react';
import NavigationBar from "./NavBar";
import Footer from "@/components/Footer";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";

const Chat = () => {
    const [chatId, setChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isRequestingSession, setIsRequestingSession] = useState(false);

    const isLoading = messages.length && messages[messages.length - 1].loading;

    async function requestSessionId() {
        setIsRequestingSession(true);
        const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
        const urlInitLLMSession = `${backendURL}/api/llmer/start_session`;
        try {
            const response = await fetch(urlInitLLMSession, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: 'ChatGPT' }),
            });
            const data = await response.json();
            setChatId(data.id);
        }
        catch (error) {
            // ToDo: add error handling
            console.error('Error requesting session ID:', error);
        }
        finally {
            setIsRequestingSession(false);
        }
    }

    async function submitNewMessage() {
        const trimmedMessage = newMessage.trim();
        if (!trimmedMessage || isLoading) return;

        // Add user message and loading assistant message
        setMessages(prev => [
            ...prev,
            { role: 'user', content: trimmedMessage },
            { role: 'assistant', content: '', loading: true }
        ]);
        setNewMessage('');

        try {
            // Placeholder for streaming response
            // Simulate streaming by updating the last assistant message
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: (updated[updated.length - 1].content || '') + 'Hello! This is a mock response.',
                };
                return updated;
            });
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    loading: false,
                };
                return updated;
            });
        } catch (err) {
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    loading: false,
                    error: true,
                };
                return updated;
            });
        }
    }

    return (
        <div className="empty">
            <NavigationBar />
            <div className="content-holder-container">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                    <button
                        onClick={requestSessionId}
                        disabled={!!chatId || isRequestingSession}
                        style={{
                            padding: '8px 24px',
                            borderRadius: 8,
                            background: chatId ? '#b3b3b3' : '#4f8cff',
                            color: '#fff',
                            border: 'none',
                            fontWeight: 'bold',
                            cursor: chatId ? 'not-allowed' : 'pointer',
                            opacity: isRequestingSession ? 0.7 : 1
                        }}
                    >
                        {chatId ? 'ChatGPT (active)' : isRequestingSession ? 'Requesting...' : 'ChatGPT'}
                    </button>
                </div>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', margin: '2rem 0', color: '#666' }}>
                        <b>Welcome to the Chatbot!</b> <br />
                        Ask me anything.
                    </div>
                )}
                <ChatMessages messages={messages} isLoading={isLoading} />
                <ChatInput
                    newMessage={newMessage}
                    isLoading={isLoading}
                    setNewMessage={setNewMessage}
                    submitNewMessage={submitNewMessage}
                />
            </div>
            <Footer />
        </div>
    );
};

export default Chat; 