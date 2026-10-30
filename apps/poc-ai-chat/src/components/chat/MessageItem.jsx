import React, { useState } from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';

export default function MessageItem({ message }) {
  const [copiedId, setCopiedId] = useState(null);

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderContent = (content) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const firstLineEnd = part.indexOf('\n');
        const lang = firstLineEnd > 3 ? part.slice(3, firstLineEnd).trim() : 'code';
        const code = firstLineEnd !== -1 ? part.slice(firstLineEnd + 1, -3) : part.slice(3, -3);
        const codeId = `code-${idx}`;

        return (
          <div key={idx} className="my-2.5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-[11px]">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 text-slate-400 border-b border-slate-800">
              <span className="uppercase text-[10px] tracking-wider text-slate-400">{lang || 'Code'}</span>
              <button 
                onClick={() => copyCode(code, codeId)}
                className="flex items-center gap-1 hover:text-white text-[10px] transition-colors"
              >
                {copiedId === codeId ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">복사됨</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>복사</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 text-emerald-300 overflow-x-auto whitespace-pre">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      return <span key={idx} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-2.5 sm:gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        isUser ? 'bg-blue-600 text-white' : 'bg-slate-800 text-blue-400 border border-slate-750'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div className={`max-w-[85%] sm:max-w-md md:max-w-xl rounded-2xl p-3 sm:p-4 text-xs sm:text-sm leading-relaxed ${
        isUser 
          ? 'bg-blue-600 text-white rounded-tr-xs shadow-md' 
          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs shadow-sm'
      }`}>
        {renderContent(message.content)}
      </div>
    </div>
  );
}

