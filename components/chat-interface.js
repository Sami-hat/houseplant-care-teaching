'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import { stripJsonFromResponse } from '@/lib/utils';
import styles from './chat-interface.module.css';

export function ChatInterface({ apiEndpoint, conceptId, initialMessage, autoStart }) {
  const initialMessages = [];

  if (initialMessage) {
    initialMessages.push({ id: '1', role: 'assistant', content: initialMessage });
  } else if (autoStart) {
    initialMessages.push({ id: '1', role: 'user', content: 'Please teach me about this concept.' });
  }

  const { messages, input, handleInputChange, handleSubmit, isLoading, reload } = useChat({
    api: apiEndpoint,
    body: { conceptId },
    initialMessages,
  });

  const hasStarted = useRef(false);
  const reloadRef = useRef(reload);
  reloadRef.current = reload;

  useEffect(() => {
    if (autoStart && !hasStarted.current && !initialMessage) {
      hasStarted.current = true;
      // Delay to ensure component is mounted
      setTimeout(() => {
        reloadRef.current();
      }, 100);
    }
  }, [autoStart, initialMessage]);

  // Filter out the auto-start message from display
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

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your answer..."
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
