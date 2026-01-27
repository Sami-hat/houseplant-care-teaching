'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect, useMemo } from 'react';
import Markdown from 'react-markdown';
import { stripJsonFromResponse } from '@/lib/utils';
import styles from './chat-interface.module.css';

function getMessageText(message) {
  if (message?.parts) {
    return message.parts
      .filter(part => part.type === 'text')
      .map(part => part.text)
      .join('');
  }
  return message?.content || '';
}

function speak(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v =>
    v.name.includes('Google') ||
    v.name.includes('Natural') ||
    v.name.includes('Neural') ||
    v.name.includes('Samantha') ||
    v.name.includes('Microsoft')
  ) || voices.find(v => v.lang.startsWith('en'));

  if (preferredVoice) speech.voice = preferredVoice;
  speech.rate = 1.0;
  speech.pitch = 1.0;

  window.speechSynthesis.speak(speech);
}

export function ChatInterface({ apiEndpoint, conceptId, initialMessage, autoStart, placeholder = "Type your answer..." }) {
  const [input, setInput] = useState('');
  const hasAutoStarted = useRef(false);

  const transport = useMemo(() => new DefaultChatTransport({
    api: apiEndpoint,
    body: { conceptId },
  }), [apiEndpoint, conceptId]);

  const { messages, sendMessage, status } = useChat({
    transport,
    initialMessages: initialMessage ? [
      { id: '1', role: 'assistant', parts: [{ type: 'text', text: initialMessage }] }
    ] : [],
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  // Auto-start lesson when component mounts
  useEffect(() => {
    if (autoStart && !hasAutoStarted.current && sendMessage) {
      // Small delay to ensure hook is fully initialized
      const timer = setTimeout(() => {
        if (!hasAutoStarted.current) {
          hasAutoStarted.current = true;
          sendMessage({ text: 'Please teach me about this concept.' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoStart, sendMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !sendMessage) return;
    sendMessage({ text: input });
    setInput('');
  };

  // Filter out the starter message from display
  const displayMessages = messages.filter(
    (m) => !(m.role === 'user' && getMessageText(m) === 'Please teach me about this concept.')
  );

  return (
    <div className={styles.container}>
      <div className={styles.messages}>
        {displayMessages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${message.role === 'assistant' ? styles.assistant : styles.user}`}
          >
            {message.role === 'assistant' ? (
              <>
                <Markdown>{stripJsonFromResponse(getMessageText(message))}</Markdown>
                <button
                  type="button"
                  onClick={() => speak(stripJsonFromResponse(getMessageText(message)))}
                  className={styles.speakButton}
                  title="Read aloud"
                >
                  🔊
                </button>
              </>
            ) : (
              stripJsonFromResponse(getMessageText(message))
            )}
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
          onChange={(e) => setInput(e.target.value)}
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
