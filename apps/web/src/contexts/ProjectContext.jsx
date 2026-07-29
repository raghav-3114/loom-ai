/**
 * @file ProjectContext.jsx
 * @description Context managing active project stack ("vanilla" | "react-tailwind"), project files, and active file state.
 */

import React, { createContext, useContext, useState } from 'react';

const ProjectContext = createContext(null);

const MOCK_VANILLA_FILES = {
  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Loom AI Generated Project</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="container">
    <header>
      <h1>✨ Welcome to Loom AI</h1>
      <p>Generated Vanilla HTML/CSS/JS Application</p>
    </header>
    <main>
      <button id="counterBtn" class="btn">Click me: <span id="count">0</span></button>
    </main>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
  'style.css': `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0f172a;
  color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.container {
  text-align: center;
  padding: 2.5rem;
  background: rgba(30, 41, 59, 0.7);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
}
.btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}
.btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}`,
  'script.js': `let count = 0;
const btn = document.getElementById('counterBtn');
const countEl = document.getElementById('count');

if (btn && countEl) {
  btn.addEventListener('click', () => {
    count++;
    countEl.textContent = count;
  });
}`
};

const MOCK_REACT_FILES = {
  '/App.js': `import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center backdrop-blur-xl">
        <div className="inline-flex p-3 bg-indigo-500/10 rounded-xl text-indigo-400 mb-4 border border-indigo-500/20">
          ✨ Loom AI Generated App
        </div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent mb-3">
          React + Tailwind Project
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Created with Loom AI Builder Agent. Interactive state & responsive Tailwind styling.
        </p>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-95"
        >
          Clicked {count} times
        </button>
      </div>
    </div>
  );
}`
};

export function ProjectProvider({ children }) {
  // "vanilla" | "react-tailwind"
  const [activeStack, setActiveStack] = useState('vanilla');
  const [projectTitle, setProjectTitle] = useState('Untitled Project');
  const [files, setFiles] = useState(MOCK_VANILLA_FILES);
  const [activeFileName, setActiveFileName] = useState('index.html');

  const switchStack = (stack) => {
    setActiveStack(stack);
    if (stack === 'vanilla') {
      setFiles(MOCK_VANILLA_FILES);
      setActiveFileName('index.html');
    } else {
      setFiles(MOCK_REACT_FILES);
      setActiveFileName('/App.js');
    }
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
