/**
 * @file LandingView.jsx
 * @description Minimal Claude-style landing view featuring centered LOOM wordmark, headline, subtitle, stack selector, prompt box, CTA buttons, and prompt chips.
 */

import React from 'react';
import { Sparkles, Upload, ArrowRight } from 'lucide-react';
import LoomLogo from '../ui/LoomLogo';
import PromptInput from '../ui/PromptInput';
import Button from '../ui/Button';
import { useUI } from '../../contexts/UIContext';
import { useChat } from '../../contexts/ChatContext';
import { useProject } from '../../contexts/ProjectContext';

export function LandingView() {
  const { setViewMode, setIsUploadModalOpen } = useUI();
  const { sendMessage, setPromptText, promptText } = useChat();
  const { activeStack } = useProject();

  const exampleChips = [
    { label: 'Build a Portfolio Website', prompt: 'Build a modern personal portfolio website with dark theme, smooth scroll navigation, project cards, and a contact form.' },
    { label: 'Create a SaaS Landing Page', prompt: 'Create a sleek SaaS landing page for an AI productivity app featuring hero section, feature grid, pricing table, and CTA footer.' },
    { label: 'Explain my React Component', prompt: 'Explain how React state and props work in my component in plain, beginner-friendly terms.' },
    { label: 'Debug my CSS Layout', prompt: 'Find and fix flexbox alignment and responsive layout overflow issues in my stylesheet.' },
  ];

  const handleChipClick = (chipPrompt) => {
    setPromptText(chipPrompt);
  };

  const handleGenerate = () => {
    if (!promptText.trim()) return;
    sendMessage(promptText, activeStack);
    setViewMode('workspace');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-slate-950">
      {/* Background Ambient Glows */}
      <div className="ambient-glow top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />

      {/* Main Centered Content */}
      <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-6 z-10 animate-fade-in">
        {/* Brand Wordmark */}
        <LoomLogo size="xl" className="mb-2" />

        {/* Headline & Subtitle */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            Build Frontend Projects with AI
          </h1>
          <p className="text-base text-slate-400 max-w-lg mx-auto font-normal leading-relaxed">
            Generate, understand and debug HTML, CSS, JavaScript and React projects using AI.
          </p>
        </div>

        {/* Prompt Input Box */}
        <div className="w-full pt-2">
          <PromptInput onSend={() => handleGenerate()} />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-1">
          <Button variant="primary" size="md" onClick={handleGenerate}>
            <span>Generate Project</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="glass" size="md" onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="w-4 h-4" />
            <span>Upload Existing Project</span>
          </Button>
        </div>

        {/* Prompt Suggestion Chips */}
        <div className="w-full pt-4 space-y-2">
          <div className="text-xs text-slate-500 font-medium tracking-wide">Or try an example prompt:</div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {exampleChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(chip.prompt)}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-indigo-500/40 text-xs font-medium text-slate-300 hover:text-white transition-all shadow-sm flex items-center gap-1.5 group"
              >
                <Sparkles className="w-3 h-3 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingView;
