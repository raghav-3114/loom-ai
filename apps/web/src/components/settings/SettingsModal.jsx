/**
 * @file SettingsModal.jsx
 * @description Settings modal tabbed configuration view for theme, AI provider, model stubs, and About Loom information.
 */

import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Tabs from '../ui/Tabs';
import Dropdown from '../ui/Dropdown';
import Button from '../ui/Button';
import LoomLogo from '../ui/LoomLogo';
import { useUI } from '../../contexts/UIContext';

export function SettingsModal() {
  const { isSettingsModalOpen, setIsSettingsModalOpen, showToast } = useUI();
  const [activeTab, setActiveTab] = useState('general');
  const [provider, setProvider] = useState('openrouter');
  const [model, setModel] = useState('qwen-coder');

  const tabs = [
    { id: 'general', label: 'General & Theme' },
    { id: 'ai', label: 'AI Providers & Models' },
    { id: 'about', label: 'About LOOM AI' },
  ];

  const providerOptions = [
    { value: 'openrouter', label: 'OpenRouter API', badge: 'Primary' },
    { value: 'groq', label: 'Groq API', badge: 'Fast Inferences' },
    { value: 'gemini', label: 'Google Gemini API', badge: 'Fallback' },
  ];

  const modelOptions = [
    { value: 'qwen-coder', label: 'Qwen 2.5 Coder 7B', badge: 'Builder Agent' },
    { value: 'qwen-router', label: 'Qwen 2.5 3B Instruct', badge: 'Router Agent' },
    { value: 'llama-reviewer', label: 'Llama 3.1 8B', badge: 'Reviewer Agent' },
  ];

  return (
    <Modal
      isOpen={isSettingsModalOpen}
      onClose={() => setIsSettingsModalOpen(false)}
      title="Settings"
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab 1: General */}
        {activeTab === 'general' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200">Theme Mode</div>
                <div className="text-slate-400">Deep Charcoal Dark Glassmorphism</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">
                Dark Only
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: AI Settings */}
        {activeTab === 'ai' && (
          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <label className="block text-slate-300 font-medium">Default AI Provider Placeholder</label>
              <Dropdown items={providerOptions} value={provider} onChange={setProvider} />
            </div>

            <div className="space-y-2">
              <label className="block text-slate-300 font-medium">Primary Generation Model Placeholder</label>
              <Dropdown items={modelOptions} value={model} onChange={setModel} />
            </div>
          </div>
        )}

        {/* Tab 3: About Loom */}
        {activeTab === 'about' && (
          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <LoomLogo size="md" />
              <span className="text-slate-400">v1.0.0 (Hackathon MVP)</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              Loom AI is a specialized frontend development assistant designed specifically for students and beginner developers. Supports generation, explanation, and debugging across <strong>Vanilla HTML/CSS/JS</strong> and <strong>React + Tailwind CSS</strong> stacks.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <Button variant="primary" size="sm" onClick={() => {
            setIsSettingsModalOpen(false);
            showToast('Settings saved', 'success');
          }}>
            Save & Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default SettingsModal;
