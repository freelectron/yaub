import React, { useRef, useEffect } from 'react';

function ChatInput({ chatId, newMessage, isLoading, setNewMessage, submitNewMessage }) {
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [newMessage]);

  function handleKeyDown(e) {
    if (e.keyCode === 13 && !e.shiftKey && !isLoading) {
      e.preventDefault();
      submitNewMessage();
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div style={{ width: '100%', maxWidth: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
        <textarea
          ref={textareaRef}
          rows={1}
          value={newMessage}
          disabled={isLoading}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          style={{ width: '100%', minHeight: 100, fontSize: 12, resize: 'none', boxSizing: 'border-box', padding: '6px' }}
        />
        <button 
          onClick={submitNewMessage} 
          disabled={isLoading || !newMessage.trim() || !chatId}
          style={{ width: 60, height: 40 }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatInput; 