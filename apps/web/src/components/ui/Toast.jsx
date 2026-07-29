/**
 * @file Toast.jsx
 * @description Floating notification toast component.
 */

import React from 'react';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';

export function Toast({ message, type = 'info' }) {
  if (!message) return null;

  const icons = {
    info: <Info className="w-4 h-4 text-indigo-400" />,
    success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900/90 border border-white/15 rounded-xl shadow-2xl backdrop-blur-xl text-slate-100 text-xs animate-fade-in">
      {icons[type]}
      <span>{message}</span>
    </div>
  );
}

export default Toast;
