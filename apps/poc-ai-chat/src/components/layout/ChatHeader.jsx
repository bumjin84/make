import React from 'react';
import { ArrowLeft, Menu, Key, RefreshCw, Loader2 } from 'lucide-react';

export default function ChatHeader({
  apiKey,
  title,
  isTyping,
  onOpenSidebar,
  onOpenKeyModal,
  onResetSession
}) {
  return (
    <header className="h-14 shrink-0 bg-slate-900/90 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between z-10 backdrop-blur">
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
          title="대화 목록 열기"
        >
          <Menu className="w-5 h-5" />
        </button>

        <a 
          href="../"
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Portal</span>
        </a>

        <div className="hidden sm:flex items-center gap-2 max-w-[200px] md:max-w-xs truncate text-xs text-slate-400 font-medium pl-2 border-l border-slate-800">
          <span className="truncate text-slate-300">{title}</span>
          {isTyping && (
            <span className="inline-flex items-center gap-1 text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 shrink-0">
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
              <span>응답 작성 중</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenKeyModal}
          className={`flex items-center gap-1.5 text-[11px] sm:text-xs font-medium px-2.5 py-1 rounded-full border transition-all active:scale-95 ${
            apiKey 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
          }`}
        >
          <Key className="w-3 h-3" />
          <span>{apiKey ? 'Gemini 2.5 Live' : 'Mock Mode (키 등록)'}</span>
        </button>

        <button
          onClick={onResetSession}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="현재 대화방 초기화"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

