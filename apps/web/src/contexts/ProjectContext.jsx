/**
 * @file ProjectContext.jsx
 * @description Context managing active project stack ("vanilla" | "react-tailwind"), project files, and active file state.
 */

import React, { createContext, useContext, useState } from 'react';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  // "vanilla" | "react-tailwind"
  const [activeStack, setActiveStack] = useState('vanilla');
  const [projectTitle, setProjectTitle] = useState('Untitled Project');
  // Start empty — Live Preview should show its standby state until the
  // user actually generates or uploads a project, never a placeholder mock.
  const [files, setFiles] = useState({});
  const [activeFileName, setActiveFileName] = useState(null);

  const switchStack = (stack) => {
    setActiveStack(stack);
    setFiles({});
    setActiveFileName(null);
  };

  const value = {
    activeStack,
    setActiveStack: switchStack,
    projectTitle,
    setProjectTitle,
    files,
    setFiles,
    activeFileName,
    setActiveFileName,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}

export { ProjectContext };
export default ProjectContext;
