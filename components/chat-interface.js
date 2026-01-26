'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import { stripJsonFromResponse } from '@/lib/utils';
import styles from './chat-interface.module.css';

export function ChatInterface({ apiEndpoint, conceptId, initialMessage, autoStart }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: apiEndpoint,
    body: { conceptId },
    initialMessages: initialMessage ? [
      { id: '1', role: 'assistant', content: initialMessage }
    ] : [],
  });

  const hasStarted = useRef(false);

  useEffect(() => {
    if (autoStart && !hasStarted.current && messages.length === 0) {
      hasStarted.current = true;
      append({ role: 'user', content: 'Please teach me about this concept.' });
    }
  }, [autoStart, append, messages.length]);

  return (
    <div className={styles.container}>
      <div className={styles.messages}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${message.role === 'assistant' ? styles.assistant : styles.user}`}
          >
            {message.role === 'user' && message.content === 'Please teach me about this concept.'
              ? null
              : stripJsonFromResponse(message.content)}
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
