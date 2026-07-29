/**
 * @file LoomLogo.jsx
 * @description Original text-only futuristic wordmark for LOOM.
 * Features tracking, metallic purple-blue gradient text fill, subtle ambient glow, and scalable sizing.
 */

import React from 'react';

/**
 * LoomLogo component
 * @param {Object} props
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md'] - Logo text size
 * @param {string} [props.className=''] - Additional CSS classes
 */
export function LoomLogo({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'text-lg tracking-[0.25em]',
    md: 'text-2xl tracking-[0.3em]',
    lg: 'text-4xl tracking-[0.35em]',
    xl: 'text-6xl tracking-[0.4em]',
  };

  return (
    <div className={`inline-flex items-center select-none ${className}`} aria-label="LOOM AI Logo">
      <span
        className={`font-black font-mono uppercase bg-gradient-to-r from-white via-indigo-200 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300 hover:drop-shadow-[0_0_25px_rgba(139,92,246,0.8)] ${sizeClasses[size]}`}
      >
        LOOM
      </span>
      <span className="ml-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1] animate-pulse" />
    </div>
  );
}

export default LoomLogo;
