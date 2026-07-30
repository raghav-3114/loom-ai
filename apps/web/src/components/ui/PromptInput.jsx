/**
 * @file PromptInput.jsx
 * @description Premium rounded prompt input container with integrated Stack Selector toggle, Send, Upload, Attach buttons, and character counter.
 */

import React from 'react';
import { Send, Upload, Paperclip, Plus } from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';
import { useUI } from '../../contexts/UIContext';
import { useChat } from '../../contexts/ChatContext';

export function PromptInput({ onSend, isGenerating = false, isLanding = false }) {
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

  if (isLanding) {
    return (
      <div className="w-full relative flex items-center bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2.5 pl-3 pr-2.5 shadow-2xl focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all duration-300">
        {/* Left: Upload Button (+) */}
        <button
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-all active:scale-95 flex items-center justify-center"
          title="Upload Project Zip/Files"
          aria-label="Upload Project"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Input Textarea */}
        <textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What do you want to build?"
          rows={1}
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-base resize-none focus:outline-none custom-scrollbar pl-2.5 pr-2 py-2"
          maxLength={2000}
        />

        {/* Right: Character Counter & Send */}
        <div className="flex items-center gap-3 ml-1">
          {promptText.length > 0 && (
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
              {promptText.length}/2000
            </span>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!promptText.trim() || isGenerating}
            className="p-2.5 bg-white text-slate-950 hover:bg-slate-200 rounded-xl shadow-lg disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 flex items-center justify-center"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4 text-slate-950 fill-current" />
          </button>
        </div>
      </div>
    );
  }

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
          {/* Stack Toggle — compact pill, visual only, logic unchanged */}
          <div className="flex items-center gap-0.5 bg-white/[0.03] p-0.5 rounded-full border border-white/[0.06] text-[10px]">
            <button
              type="button"
              onClick={() => setActiveStack('vanilla')}
              title="Vanilla HTML/CSS/JS"
              className={`px-2.5 py-1 rounded-full transition-all font-medium ${
                activeStack === 'vanilla'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Vanilla
            </button>
            <button
              type="button"
              onClick={() => setActiveStack('react-tailwind')}
              title="React + Tailwind"
              className={`px-2.5 py-1 rounded-full transition-all font-medium ${
                activeStack === 'react-tailwind'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              React
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
