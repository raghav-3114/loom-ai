/**
 * @file MessageBubble.jsx
 * @description Claude-style AI conversation bubble supporting markdown formatting, code cards, explanation cards, and actions.
 */

import React from 'react';
import { User, RefreshCw, FileCode, Info } from 'lucide-react';
import LoomLogo from '../ui/LoomLogo';
import CodeBlock from './CodeBlock';
import Badge from '../ui/Badge';

export function MessageBubble({ message, onRegenerate }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 p-4 rounded-2xl transition-colors ${isUser ? 'bg-slate-900/40 border border-white/5' : 'bg-slate-900/80 border border-white/10'}`}>
      {/* Avatar */}
      <div className="shrink-0 pt-0.5">
        {isUser ? (
          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shadow-md">
            <User className="w-4 h-4" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <LoomLogo size="sm" className="text-white scale-75" />
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 space-y-3 min-w-0">
        {/* Header line */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">{isUser ? 'You' : 'LOOM AI'}</span>
            {message.stack && (
              <Badge variant={message.stack === 'vanilla' ? 'indigo' : 'purple'}>
                {message.stack === 'vanilla' ? 'Vanilla HTML/CSS/JS' : 'React + Tailwind'}
              </Badge>
            )}
          </div>
          <span className="text-[11px] text-slate-500">{message.timestamp}</span>
        </div>

        {/* Text Body */}
        <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
          {message.content}
        </div>

        {/* Code Card */}
        {message.codeCard && (
          <CodeBlock
            code={message.codeCard.code}
            language={message.codeCard.language}
            title={message.codeCard.title}
          />
        )}

        {/* Explanation Card */}
        {message.explanationCard && (
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-indigo-300">
              <Info className="w-4 h-4" />
              <span>{message.explanationCard.title}</span>
            </div>
            <p className="text-slate-400 leading-relaxed">{message.explanationCard.details}</p>
          </div>
        )}

        {/* Actions for Assistant message */}
        {!isUser && (
          <div className="flex items-center gap-2 pt-1 text-xs">
            <button
              onClick={() => onRegenerate && onRegenerate(message.id)}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
