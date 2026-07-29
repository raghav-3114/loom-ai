/**
 * @file UIContext.jsx
 * @description Centralized context for Loom AI UI state management.
 * Manages view mode (landing vs workspace), sidebar state, modal visibility, device preview mode, and toasts.
 */

import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  // 'landing' or 'workspace'
  const [viewMode, setViewMode] = useState('landing');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  // 'desktop' | 'tablet' | 'mobile'
  const [devicePreviewMode, setDevicePreviewMode] = useState('desktop');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  
  const value = {
    viewMode,
    setViewMode,
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar,
    isUploadModalOpen,
    setIsUploadModalOpen,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    devicePreviewMode,
    setDevicePreviewMode,
    toastMessage,
    showToast,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

export default UIContext;
