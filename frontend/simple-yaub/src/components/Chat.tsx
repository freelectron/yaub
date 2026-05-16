"use client";
import React, { useState } from 'react';
import NavigationBar from "./NavBar";
import Footer from "@/components/Footer";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";

interface SessionProps {
  session?: any;
}

type Message = {
  role: string;
  content: string;
  loading?: boolean;
};

async function requestSessionIdBackend(user: string, mode: string = 'QuestionAnsweringChatBot'): Promise<string> {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL_PUBLIC || 'http://localhost:3001';
  const urlInitLLMSession = `${backendURL}/api/llmer/start_session`;

  const response = await fetch(urlInitLLMSession, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, mode }),
  });

  const data = await response.json();
  return data.id;
}

async function sendMessageBackend(chatId: string, trimmedMessage: string): Promise<string> {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
  const urlSendMessage = `${backendURL}/api/llmer/send_message`;

  const response = await fetch(urlSendMessage, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: chatId,
      system_prompt: '',
      question_prompt: trimmedMessage,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data || !data.text) {
    throw new Error('Invalid response format.');
  }

  return data.text;
}

const Chat: React.FC<SessionProps> = (session) => {
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isRequestingSession, setIsRequestingSession] = useState<boolean>(false);

  const isLoading = messages.length > 0 && !!messages[messages.length - 1].loading;

  async function requestSessionId(userId: string) {
    setIsRequestingSession(true);
    try {
      const sessionId = await requestSessionIdBackend(userId);
      setChatId(sessionId);
    } catch (error) {
      console.error('Error requesting session ID:', error);
    } finally {
      setIsRequestingSession(false);
    }
  }

  function SetLastAnswer(answer: string) {
    setMessages(prev => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        content: (updated[updated.length - 1].content || '') + answer,
        loading: false,
      };
      return updated;
    });
  }

  function AppendNewQuestionAnswer(messageContent: string) {
    setMessages(prev => [
      ...prev,
      { role: 'user', content: messageContent },
      { role: 'assistant', content: '', loading: true },
    ]);
    setNewMessage('');
  }

  async function submitNewMessage(): Promise<void> {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || isLoading) return;

    AppendNewQuestionAnswer(trimmedMessage);

    try {
      const answer = await sendMessageBackend(chatId as string, trimmedMessage);
      SetLastAnswer(answer);
    } catch (error) {
      console.error('Error sending message:', error);
      SetLastAnswer("Failed to get a response :'(");
    }
  }

  if (!session.session) {
    return (
      <div className="empty">
        <NavigationBar />
        <div className="content-holder-container">
          <div style={{ textAlign: 'center', margin: '2rem 0', color: '#666' }}>
            <b>Welcome to the Chatbot!</b> <br />
            Please log in to start chatting.
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="empty">
      <NavigationBar />
      <div className="content-holder-container">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <button
            onClick={() => requestSessionId(session.session.user.id)}
            disabled={!!chatId || isRequestingSession}
            style={{
              padding: '8px 24px',
              borderRadius: 8,
              background: chatId ? '#b3b3b3' : '#4f8cff',
              color: '#fff',
              border: 'none',
              fontWeight: 'bold',
              cursor: chatId ? 'not-allowed' : 'pointer',
              opacity: isRequestingSession ? 0.7 : 1,
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
          chatId={chatId}
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
