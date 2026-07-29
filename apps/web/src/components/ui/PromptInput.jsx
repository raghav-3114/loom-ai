/**
 * @file PromptInput.jsx
 * @description Premium rounded prompt input container with integrated Stack Selector toggle, Send, Upload, Attach buttons, and character counter.
 */

import React from 'react';
import { Send, Upload, Paperclip, Sparkles, Layers } from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';
import { useUI } from '../../contexts/UIContext';
import { useChat } from '../../contexts/ChatContext';

export function PromptInput({ onSend, isGenerating = false }) {
  const { activeStack, setActiveStack } = useProject();
  const { setIsUploadModalOpen, showToast } = useUI();
  const { promptText, setPromptText } = useChat();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!promptText.trim() || isGenerating) return;
    if (onSend) {
      onSend(promptText, activeStack);
    }
  };

  return (
    <div className="w-full relative bg-slate-900/80 backdrop-blur-xl border border-white/12 rounded-2xl p-3 shadow-2xl focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-300">
      {/* Input Textarea */}
      <textarea
        value={promptText}
        onChange={(e) => setPromptText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          activeStack === 'vanilla'
            ? 'Describe your Vanilla HTML/CSS/JS project or ask to explain/debug code...'
            : 'Describe your React + Tailwind component or ask to explain/debug JSX...'
        }
        rows={2}
        className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm resize-none focus:outline-none custom-scrollbar px-1 py-0.5"
        maxLength={2000}
      />

      {/* Toolbar Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
        {/* Left: Stack Selector & File Actions */}
        <div className="flex items-center gap-2">
          {/* Stack Toggle */}
          <div className="flex items-center bg-slate-950/80 p-0.5 rounded-xl border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setActiveStack('vanilla')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                activeStack === 'vanilla'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Vanilla</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStack('react-tailwind')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                activeStack === 'react-tailwind'
                  ? 'bg-purple-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>React + Tailwind</span>
            </button>
          </div>

          {/* Upload Button */}
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors"
            title="Upload Project Zip/Files"
            aria-label="Upload Project"
          >
            <Upload className="w-4 h-4" />
          </button>

          {/* Attach Button */}
          <button
            type="button"
            onClick={() => showToast('Attach file snippet feature ready', 'info')}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors"
            title="Attach Snippet"
            aria-label="Attach Snippet"
          >
            <Paperclip className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Character Counter & Send */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500 font-mono">
            {promptText.length}/2000
          </span>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!promptText.trim() || isGenerating}
            className="p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-95"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PromptInput;
