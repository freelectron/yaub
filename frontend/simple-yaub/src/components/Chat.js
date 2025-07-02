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

    const isLoading = messages.length && messages[messages.length - 1].loading;

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

        let chatIdOrNew = chatId;
        try {
            // Placeholder for API call to create chat
            if (!chatId) {
                // Simulate API call
                const id = 'mock-chat-id';
                setChatId(id);
                chatIdOrNew = id;
            }
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