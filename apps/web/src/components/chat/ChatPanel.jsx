/**
 * @file ChatPanel.jsx
 * @description Main conversation stream container for displaying message bubbles, streaming thinking indicators, and bottom prompt input.
 */

import React, { useEffect, useRef } from 'react';
import { Sparkles, Bot } from 'lucide-react';
import MessageBubble from './MessageBubble';
import PromptInput from '../ui/PromptInput';
import { useChat } from '../../contexts/ChatContext';

export function ChatPanel() {
  const { messages, sendMessage, isGenerating, thinkingStep } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating, thinkingStep]);

  return (
    <div className="h-full flex flex-col justify-between bg-slate-950/60 relative overflow-hidden">
      {/* Scrollable Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            // Never re-submit error text as a new user turn — error messages have no regenerate
            onRegenerate={msg.isError ? null : () => sendMessage(msg.content)}
          />
        ))}

        {/* Thinking / Streaming Indicator */}
        {isGenerating && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 animate-pulse">
            <div className="w-7 h-7 rounded-xl bg-indigo-600/30 flex items-center justify-center text-indigo-300">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LOOM AI is thinking...</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">{thinkingStep || 'Processing response...'}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Sticky Prompt Input */}
      <div className="p-4 border-t border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <PromptInput onSend={(text, stack) => sendMessage(text, stack)} isGenerating={isGenerating} />
      </div>
    </div>
  );
}

export default ChatPanel;
