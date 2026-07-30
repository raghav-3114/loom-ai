/**
 * @file ReactTailwindPreview.jsx
 * @description In-browser bundler sandbox preview component for React + Tailwind CSS code using Sandpack or container stub.
 */

import React from 'react';
import { SandpackProvider, SandpackPreview } from '@codesandbox/sandpack-react';

export function ReactTailwindPreview({ files }) {
  // 1. Map all files from ProjectContext to Sandpack, standardizing path keys
  const sandpackFiles = {};
  Object.entries(files || {}).forEach(([path, content]) => {
    const sandpackPath = path.startsWith('/') ? path : `/${path}`;
    sandpackFiles[sandpackPath] = content;
  });

  // 2. Inject Tailwind CSS Play CDN script to Sandpack HTML entry point
  sandpackFiles['/public/index.html'] = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <script src="https://cdn.tailwindcss.com"></script>
    <title>Loom React App</title>
  </head>
  <body class="bg-slate-950 text-slate-100 min-h-screen">
    <div id="root"></div>
  </body>
</html>
  `.trim();

  // 3. Fallback entry logic to ensure dynamic components (e.g. /Counter.js) render in /App.js
  const hasAppFile = sandpackFiles['/App.js'] || sandpackFiles['/App.jsx'] || sandpackFiles['/src/App.js'] || sandpackFiles['/src/App.jsx'];
  if (!hasAppFile) {
    // Find the first component file in the project
    const componentFile = Object.keys(sandpackFiles).find(
      (path) => (path.endsWith('.js') || path.endsWith('.jsx')) && path !== '/public/index.html'
    );
    if (componentFile) {
      const compName = componentFile.split('/').pop().replace(/\.(js|jsx)$/, '');
      sandpackFiles['/App.js'] = `
import React from 'react';
import ${compName} from '.${componentFile}';

export default function App() {
  return <${compName} />;
}
      `.trim();
    } else {
      sandpackFiles['/App.js'] = `
import React from 'react';

export default function App() {
  return (
    <div className="flex items-center justify-center min-h-screen text-slate-400">
      No React component found in the project.
    </div>
  );
}
      `.trim();
    }
  }

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
