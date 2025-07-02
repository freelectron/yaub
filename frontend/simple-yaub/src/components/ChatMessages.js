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
      {messages.map(({ role, content, loading, error }, idx) => (
        <div key={idx} style={{ padding: '8px 0' }}>
          <div>
            {(loading && !content) ? <Spinner />
              : <div>{content}</div>
            }
          </div>
          {error && (
            <div>
              Error generating the response
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ChatMessages; 