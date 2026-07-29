import React from 'react';
import { RotateCw, ExternalLink, Eye, Download } from 'lucide-react';
import DeviceSwitcher from './DeviceSwitcher';
import Badge from './Badge';
import { useProject } from '../../contexts/ProjectContext';
import { useUI } from '../../contexts/UIContext';
import { useChat } from '../../contexts/ChatContext';
import { triggerProjectDownload } from '../../lib/apiClient';

export function PreviewToolbar({ onRefresh }) {
  const { activeStack } = useProject();
  const { showToast } = useUI();
  const { activeProjectId } = useChat();

  const handleDownload = () => {
    if (!activeProjectId) {
      showToast('Generate a project before downloading', 'warning');
      return;
    }
    triggerProjectDownload(activeProjectId);
    showToast('Preparing ZIP export...', 'success');
  };

  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/60 border-b border-white/10 backdrop-blur-md">
      {/* Title & Stack Badge */}
      <div className="flex items-center gap-2.5">
        <Eye className="w-4 h-4 text-indigo-400" />
        <span className="text-xs font-semibold text-slate-200 tracking-wide">Live Preview</span>
        <Badge variant={activeStack === 'vanilla' ? 'indigo' : 'purple'}>
          {activeStack === 'vanilla' ? 'Vanilla HTML/CSS/JS' : 'React + Tailwind'}
        </Badge>
      </div>

      {/* Device Switcher & Quick Actions */}
      <div className="flex items-center gap-2">
        <DeviceSwitcher />
        
        <button
          onClick={onRefresh}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors"
          title="Refresh Preview"
          aria-label="Refresh Preview"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => showToast('Opening preview in external window...', 'info')}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors"
          title="Open in new window"
          aria-label="Open in new window"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleDownload}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors"
          title="Download Project ZIP"
          aria-label="Download Project ZIP"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default PreviewToolbar;
