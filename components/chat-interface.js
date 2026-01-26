'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect } from 'react';
import { stripJsonFromResponse } from '@/lib/utils';
import styles from './chat-interface.module.css';

export function ChatInterface({ apiEndpoint, conceptId, initialMessage, autoStart, placeholder = "Type your answer..." }) {
  const formRef = useRef(null);
  const hasAutoStarted = useRef(false);

  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading } = useChat({
    api: apiEndpoint,
    body: { conceptId },
    initialMessages: initialMessage ? [
      { id: '1', role: 'assistant', content: initialMessage }
    ] : [],
  });

  // Auto-start lesson when component mounts
  useEffect(() => {
    if (autoStart && !hasAutoStarted.current) {
      hasAutoStarted.current = true;
      setInput('Please teach me about this concept.');
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.requestSubmit();
        }
      }, 100);
    }
  }, [autoStart, setInput]);

  // Filter out the starter message from display
  const displayMessages = messages.filter(
    (m) => !(m.role === 'user' && m.content === 'Please teach me about this concept.')
  );

  return (
    <div className={styles.container}>
      <div className={styles.messages}>
        {displayMessages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${message.role === 'assistant' ? styles.assistant : styles.user}`}
          >
            {stripJsonFromResponse(message.content)}
          </div>
        ))}
        {isLoading && (
          <div className={`${styles.message} ${styles.assistant} ${styles.loading}`}>
            Thinking...
          </div>
        )}
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={isLoading}
          className={styles.input}
        />
        <button type="submit" disabled={isLoading} className={styles.button}>
          Send
        </button>
      </form>
    </div>
  );
}
