/**
 * @file PreviewPane.jsx
 * @description Main container for the Live Preview right panel, wrapping preview toolbar, device responsive frame, and dynamic stack renderers.
 */

import React, { useState } from 'react';
import PreviewToolbar from '../ui/PreviewToolbar';
import VanillaPreview from './VanillaPreview';
import ReactTailwindPreview from './ReactTailwindPreview';
import { useProject } from '../../contexts/ProjectContext';
import { useUI } from '../../contexts/UIContext';
import { useChat } from '../../contexts/ChatContext';
import EmptyState from '../ui/EmptyState';

export function PreviewPane() {
  const { activeStack, files } = useProject();
  const { devicePreviewMode } = useUI();
  const { messages } = useChat();
  const [refreshKey, setRefreshKey] = useState(0);

  const hasGeneratedCode = messages.length > 1;

  const deviceWidthClasses = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-[90%] my-auto shadow-2xl rounded-2xl border border-white/20',
    mobile: 'w-[375px] h-[667px] my-auto shadow-2xl rounded-3xl border-4 border-slate-800',
  };

  return (
    <div className="h-full flex flex-col bg-slate-950/90 border-l border-white/10 overflow-hidden">
      {/* Top Toolbar */}
      <PreviewToolbar onRefresh={() => setRefreshKey((k) => k + 1)} />

      {/* Main Preview Container Viewport */}
      <div className="flex-1 flex items-center justify-center p-4 bg-slate-900/40 relative overflow-hidden custom-scrollbar">
        {!hasGeneratedCode ? (
          <EmptyState
            title="Live Preview Standby"
            description="Enter a prompt or choose a template to see your generated HTML/CSS/JS or React website render live."
          />
        ) : (
          <div key={refreshKey} className={`transition-all duration-300 ${deviceWidthClasses[devicePreviewMode]}`}>
            {activeStack === 'vanilla' ? (
              <VanillaPreview files={files} />
            ) : (
              <ReactTailwindPreview files={files} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PreviewPane;
