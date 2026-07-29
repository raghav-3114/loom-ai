/**
 * @file UploadPanel.jsx
 * @description Drag & drop project upload modal UI with upload progress indicators, stack auto-detection, and file validation placeholders.
 */

import React, { useState } from 'react';
import { UploadCloud, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useUI } from '../../contexts/UIContext';
import { useProject } from '../../contexts/ProjectContext';
import { useChat } from '../../contexts/ChatContext';
import { uploadProject } from '../../lib/apiClient';

export function UploadPanel() {
  const { isUploadModalOpen, setIsUploadModalOpen, showToast, setViewMode } = useUI();
  const { setActiveStack, setFiles } = useProject();
  const { setActiveProjectId } = useChat();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [detectedStack, setDetectedStack] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file) => {
    setSelectedFile(file);
    // Simulate auto stack detection based on filename
    const isReact = file.name.includes('react') || file.name.endsWith('.jsx') || file.name.includes('tailwind');
    const detected = isReact ? 'react-tailwind' : 'vanilla';
    setDetectedStack(detected);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result || '';
        
        // Build mock files payload
        const uploadFiles = {
          [selectedFile.name]: content
        };

        if (detectedStack === 'vanilla' && selectedFile.name === 'index.html') {
          uploadFiles['style.css'] = `/* Generated style for uploaded file */\nbody { background: #0b0b0e; color: #f8fafc; }`;
          uploadFiles['script.js'] = `// Generated script for uploaded file\nconsole.log('App loaded');`;
        } else if (detectedStack === 'react-tailwind' && selectedFile.name.endsWith('.js')) {
          uploadFiles['/App.js'] = content;
        }

        const response = await uploadProject(uploadFiles);
        setIsUploading(false);
        setActiveStack(response.data.stack);
        setFiles(response.data.files);
        setActiveProjectId(response.data.projectId);
        setIsUploadModalOpen(false);
        setViewMode('workspace');
        showToast(response.data.message, 'success');
      } catch (err) {
        setIsUploading(false);
        showToast(`Import failed: ${err.message}`, 'warning');
      }
    };
    reader.readAsText(selectedFile);
  };

  return (
    <Modal
      isOpen={isUploadModalOpen}
      onClose={() => setIsUploadModalOpen(false)}
      title="Upload Project"
      maxWidth="max-w-md"
    >
      <div className="space-y-5">
        {/* Dropzone Area */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-white/15 bg-slate-950/40 hover:border-white/30 hover:bg-slate-950/60'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 shadow-lg">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-200 mb-1">
            Drag & drop project .zip or files here
          </p>
          <p className="text-xs text-slate-400 mb-4">Supports Vanilla HTML/CSS/JS or React + Tailwind projects</p>
          
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept=".zip,.js,.jsx,.html,.css"
              onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            />
            <Button variant="glass" size="sm">
              Browse Files
            </Button>
          </label>
        </div>

        {/* Selected File & Auto-Detection Status */}
        {selectedFile && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span className="truncate max-w-[180px]">{selectedFile.name}</span>
              </div>
              <Badge variant={detectedStack === 'vanilla' ? 'indigo' : 'purple'}>
                Auto-Detected: {detectedStack === 'vanilla' ? 'Vanilla' : 'React + Tailwind'}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Project validation complete. Ready to import state.</span>
            </div>
          </div>
        )}

        {/* Footer CTAs */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" size="sm" onClick={() => setIsUploadModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!selectedFile}
            isLoading={isUploading}
            onClick={handleUpload}
          >
            Import Project
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default UploadPanel;
