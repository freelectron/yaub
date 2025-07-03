import React from 'react';
import Spinner from './Spinner';

function ChatMessages({ messages, isLoading }) {
  const scrollContentRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollContentRef.current) {
      scrollContentRef.current.scrollTop = scrollContentRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollContentRef}>
      {messages.map((msg, idx) => (
          <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 8,
              }}
          >
            <div
                style={{
                  background: msg.role === 'user' ? '#e0f7fa' : '#f1f1f1',
                  color: '#222',
                  borderRadius: 12,
                  padding: '8px 16px',
                  maxWidth: '70%',
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}
            >
              {msg.content}
              {msg.loading && <span style={{ marginLeft: 8 }}> <Spinner /> </span>}
            </div>
          </div>
      ))}
    </div>
  );
}

export default ChatMessages;