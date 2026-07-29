/**
 * @file ReactTailwindPreview.jsx
 * @description In-browser bundler sandbox preview component for React + Tailwind CSS code using Sandpack or container stub.
 */

import React from 'react';
import { SandpackProvider, SandpackPreview } from '@codesandbox/sandpack-react';

export function ReactTailwindPreview({ files }) {
  const sandpackFiles = {
    '/App.js': files['/App.js'] || files['App.jsx'] || `export default function App() { return <div>Hello React</div>; }`,
  };

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-slate-950 flex flex-col">
      <SandpackProvider
        template="react"
        theme="dark"
        files={sandpackFiles}
        customSetup={{
          dependencies: {
            'lucide-react': 'latest',
          },
        }}
      >
        <SandpackPreview className="w-full h-full border-none" showOpenInCodeSandbox={false} showRefreshButton={false} />
      </SandpackProvider>
    </div>
  );
}

export default ReactTailwindPreview;
