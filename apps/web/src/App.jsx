/**
 * @file App.jsx
 * @description Main application shell wrapping providers, rendering in-state view transitions (LandingView vs ChatWorkspace), modals, and toasts.
 */

import React from 'react';
import { UIProvider, useUI } from './contexts/UIContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { ChatProvider } from './contexts/ChatContext';
import LandingView from './components/landing/LandingView';
import ChatWorkspace from './components/workspace/ChatWorkspace';
import UploadPanel from './components/upload/UploadPanel';
import SettingsModal from './components/settings/SettingsModal';
import Toast from './components/ui/Toast';

function AppContent() {
  const { viewMode, toastMessage } = useUI();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 font-mono antialiased overflow-hidden relative">
      {/* Global film-grain texture, sits above the background, below content */}
      <div className="grain-overlay" />

      {/* Dynamic View Transition */}
      {viewMode === 'landing' ? <LandingView /> : <ChatWorkspace />}

      {/* Global Modals */}
      <UploadPanel />
      <SettingsModal />

      {/* Global Toast */}
      {toastMessage && <Toast message={toastMessage.message} type={toastMessage.type} />}
    </div>
  );
}

export function App() {
  return (
    <UIProvider>
      <ProjectProvider>
        <ChatProvider>
          <AppContent />
        </ChatProvider>
      </ProjectProvider>
    </UIProvider>
  );
}

export default App;
