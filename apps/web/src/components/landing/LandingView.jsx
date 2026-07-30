/**
 * @file LandingView.jsx
 * @description Redesigned minimal search-engine style landing page with centered pixel wordmark, stack picker pill, and centered input.
 */

import React from 'react';
import LoomLogo from '../ui/LoomLogo';
import PromptInput from '../ui/PromptInput';
import { useUI } from '../../contexts/UIContext';
import { useChat } from '../../contexts/ChatContext';
import { useProject } from '../../contexts/ProjectContext';

export function LandingView() {
  const { setViewMode } = useUI();
  const { sendMessage, promptText } = useChat();
  const { activeStack, setActiveStack } = useProject();

  const handleGenerate = () => {
    if (!promptText.trim()) return;
    sendMessage(promptText, activeStack);
    setViewMode('workspace');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#0a0a0a]">
      {/* Background Ambient Glows — neutral depth + one faint violet accent */}
      <div className="ambient-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40 animate-pulse-slow" />
      <div className="ambient-glow-secondary top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2 opacity-50" />

      {/* Main Centered Content */}
      <div className="max-w-2xl w-full flex flex-col items-center space-y-5 z-10 animate-fade-in">
        {/* Eyebrow Label */}
        <span className="eyebrow">Your AI Frontend Assistant</span>

        {/* Brand Wordmark (Monospace Block Style) */}
        <LoomLogo size="xl" className="mb-1" />

        <p className="text-sm text-slate-400 text-center max-w-md">
          Generate, explain, and debug frontend projects — in Vanilla HTML/CSS/JS or React + Tailwind.
        </p>

        {/* Compact Pill Stack Selector */}
        <div className="flex items-center gap-0.5 bg-white/[0.03] p-0.5 rounded-full border border-white/[0.06] text-[11px] backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveStack('vanilla')}
            className={`px-3 py-1 rounded-full transition-all duration-300 font-medium ${
              activeStack === 'vanilla'
                ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/20'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Vanilla
          </button>
          <button
            type="button"
            onClick={() => setActiveStack('react-tailwind')}
            className={`px-3 py-1 rounded-full transition-all duration-300 font-medium ${
              activeStack === 'react-tailwind'
                ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/20'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            React + Tailwind
          </button>
        </div>

        {/* Prompt Input Box */}
        <div className="w-full pt-2">
          <PromptInput isLanding={true} onSend={() => handleGenerate()} />
        </div>
      </div>
    </div>
  );
}

export default LandingView;
