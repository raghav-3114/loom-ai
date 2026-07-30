/**
 * @file ChatContext.jsx
 * @description Context for managing chat message history, active input text, streaming state, and SSE stream parser.
 */

import React, { createContext, useContext, useState } from 'react';
import { useProject } from './ProjectContext';

const ChatContext = createContext(null);

const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: "Hello! I'm **Loom AI**, your frontend development assistant. Enter a prompt or select a stack below to generate, explain, or debug HTML, CSS, JavaScript, or React code.",
    timestamp: 'Just now',
  },
];

export function ChatProvider({ children }) {
  const { setFiles, projectTitle, setProjectTitle, activeStack, setActiveStack } = useProject();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(null);
  const [activeProjectId, setActiveProjectId] = useState(null);

  const sendMessage = async (text, stack = activeStack) => {
    if (!text || !text.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      stack,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setPromptText('');
    setIsGenerating(true);
    setThinkingStep('Analyzing stack requirements and classifying intent...');

    const isNew = !activeProjectId;
    const endpoint = isNew ? '/api/generate' : '/api/chat';
    const payload = isNew
      ? { prompt: text, stack }
      : { message: text, projectId: activeProjectId, stack };

    // Matches the "missing valid string content" malformed-JSON signature
    // from a flaky fallback provider — safe to retry once client-side.
    // This is purely a UX safety net; it never touches the server's own
    // bounded Reviewer retry loop.
    const isRetryableProviderGlitch = (message) =>
      /missing valid string content/i.test(message || '');

    // Runs a single generate/chat attempt end-to-end. Throws on any
    // failure so the caller can decide whether to retry or surface it.
    const attemptRequest = async () => {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Flag to propagate SSE-level errors to the outer catch
      let sseError = null;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (sseError) break; // stop reading if a server error event was received

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep remainder

        for (const line of lines) {
          const cleanLine = line.trim();
          if (cleanLine.startsWith('data: ')) {
            const rawData = cleanLine.substring(6);
            // Parse JSON safely — only catch actual parse failures here
            let data;
            try {
              data = JSON.parse(rawData);
            } catch (e) {
              console.warn('[SSE Parser] JSON parse warning:', e);
              continue; // skip malformed SSE frames
            }

            // Handle event types outside the JSON-parse try so errors escape cleanly
            if (data.type === 'thinking') {
              setThinkingStep(data.message);
            } else if (data.type === 'error') {
              // Record and break — will be thrown after the read loop exits
              sseError = new Error(data.message);
              break;
            } else if (data.type === 'done') {
              // Done event contains complete files & explanation
              setActiveProjectId(data.projectId);

              // Explain/debug/off_topic are read-only — never reset file state
              const isReadOnly = data.intent === 'explain' || data.intent === 'debug' || data.intent === 'off_topic';
              if (!isReadOnly && data.files && Object.keys(data.files).length > 0) {
                setFiles(data.files);
              }

              // If it is new project, update project title
              if (isNew) {
                setProjectTitle(text.substring(0, 30));
              }

              const assistantMsg = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                stack,
                content: data.explanation || `I've updated the **${stack === 'vanilla' ? 'Vanilla' : 'React + Tailwind'}** files based on your request.`,
                summary: data.summary,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };

              setMessages((prev) => [...prev, assistantMsg]);
            }
          }
        }
      }

      // Propagate any SSE-level error to the outer catch
      if (sseError) throw sseError;
    };

    try {
      try {
        await attemptRequest();
      } catch (error) {
        // Exactly one automatic client-side retry, only for this specific
        // provider-glitch signature — any other error (or a second failure
        // of the same kind) falls through to the normal error message below.
        if (isRetryableProviderGlitch(error.message)) {
          console.warn('[ChatContext] Retryable provider glitch, retrying once:', error.message);
          setThinkingStep('The AI provider returned an invalid response — retrying...');
          await attemptRequest();
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('[ChatContext] Streaming Error:', error);
      const errorMsg = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        isError: true,
        content: `Error: ${error.message}. Please check that the server is running and your API keys are configured correctly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
      setThinkingStep(null);
    }
  };

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
    setActiveProjectId(null);
    setFiles({});
  };

  const value = {
    messages,
    promptText,
    setPromptText,
    isGenerating,
    thinkingStep,
    sendMessage,
    clearChat,
    activeProjectId,
    setActiveProjectId,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

export { ChatContext };
export default ChatContext;
