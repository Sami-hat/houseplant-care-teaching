'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { stripJsonFromResponse } from '@/lib/utils';
import styles from './chat-interface.module.css';

export function ChatInterface({ apiEndpoint, conceptId, initialMessage, autoStart }) {
  const [started, setStarted] = useState(!!initialMessage);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: apiEndpoint,
    body: { conceptId },
    initialMessages: initialMessage ? [
      { id: '1', role: 'assistant', content: initialMessage }
    ] : [],
  });

  const startLesson = async () => {
    setStarted(true);
    // Manually submit the form with a starter message
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    if (input) {
      input.value = 'Please teach me about this concept.';
      // Trigger React's onChange
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(input, 'Please teach me about this concept.');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      // Small delay then submit
      setTimeout(() => {
        form?.requestSubmit();
      }, 50);
    }
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

      <form id="chat-form" onSubmit={handleSubmit} className={styles.form}>
        <input
          id="chat-input"
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
