'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef } from 'react';
import { stripJsonFromResponse } from '@/lib/utils';
import styles from './chat-interface.module.css';

export function ChatInterface({ apiEndpoint, conceptId, initialMessage, autoStart, placeholder = "Type your answer..." }) {
  const [started, setStarted] = useState(!!initialMessage);
  const formRef = useRef(null);
  const inputRef = useRef(null);

  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading } = useChat({
    api: apiEndpoint,
    body: { conceptId },
    initialMessages: initialMessage ? [
      { id: '1', role: 'assistant', content: initialMessage }
    ] : [],
  });

  const startLesson = () => {
    setStarted(true);
    setInput('Please teach me about this concept.');
    // Submit after state update
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }, 10);
  };

  // Filter out the starter message from display
  const displayMessages = messages.filter(
    (m) => !(m.role === 'user' && m.content === 'Please teach me about this concept.')
  );

  if (autoStart && !started && displayMessages.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.startContainer}>
          <p>Ready to learn?</p>
          <button onClick={startLesson} className={styles.startButton}>
            Start Lesson
          </button>
        </div>
      </div>
    );
  }

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
