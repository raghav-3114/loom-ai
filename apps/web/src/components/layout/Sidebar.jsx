/**
 * @file Sidebar.jsx
 * @description Collapsible left navigation sidebar containing LOOM logo, New Chat, recent chats, projects, settings trigger, and collapse toggle.
 */

import React from 'react';
import { Plus, MessageSquare, Folder, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import LoomLogo from '../ui/LoomLogo';
import SidebarItem from '../ui/SidebarItem';
import { useUI } from '../../contexts/UIContext';
import { useChat } from '../../contexts/ChatContext';

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, setIsSettingsModalOpen, setViewMode } = useUI();
  const { clearChat } = useChat();

  const handleNewChat = () => {
    clearChat();
    setViewMode('landing');
  };

  const recentChats = [
    { id: '1', label: 'Vanilla Portfolio Site' },
    { id: '2', label: 'React Tailwind SaaS Landing' },
    { id: '3', label: 'CSS Flexbox Debug Session' },
  ];

  const recentProjects = [
    { id: 'p1', label: 'Student Dashboard App' },
    { id: 'p2', label: 'Interactive Quiz Widget' },
  ];

  return (
    <aside
      className={`h-full bg-[#0a0a0a]/95 border-r border-white/5 flex flex-col justify-between transition-all duration-300 backdrop-blur-2xl z-20 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Header & Logo */}
      <div>
        <div className={`p-4 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!sidebarCollapsed && <LoomLogo size="md" />}
          <button
            onClick={toggleSidebar}
            className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-white/5 rounded-xl transition-colors"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* New Chat CTA */}
        <div className="px-3 py-2">
          <button
            onClick={handleNewChat}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/5 transition-all font-display font-medium text-xs shadow-sm ${
              sidebarCollapsed ? 'px-2' : ''
            }`}
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>New Chat</span>}
          </button>
        </div>

        {/* Navigation Sections */}
        {!sidebarCollapsed && (
          <div className="px-3 py-3 space-y-4 overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar">
            {/* Recent Conversations */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-display font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Recent Chats
              </div>
              {recentChats.map((chat) => (
                <SidebarItem
                  key={chat.id}
                  icon={MessageSquare}
                  label={chat.label}
                  onClick={() => setViewMode('workspace')}
                />
              ))}
            </div>

            {/* Projects */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-display font-semibold text-zinc-500 uppercase tracking-wider mb-2 mt-4">
                Projects
              </div>
              {recentProjects.map((project) => (
                <SidebarItem
                  key={project.id}
                  icon={Folder}
                  label={project.label}
                  onClick={() => setViewMode('workspace')}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Settings */}
      <div className="p-3 border-t border-white/5">
        <SidebarItem
          icon={Settings}
          label="Settings"
          collapsed={sidebarCollapsed}
          onClick={() => setIsSettingsModalOpen(true)}
        />
      </div>
    </aside>
  );
}

export default Sidebar;
