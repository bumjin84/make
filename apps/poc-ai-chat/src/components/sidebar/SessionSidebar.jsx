import React from 'react';
import { Plus, ChevronLeft, MessageSquare, Trash2 } from 'lucide-react';

export default function SessionSidebar({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  typingMap
}) {
  return (
    <>
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 sm:w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-14 p-3 border-b border-slate-800 flex items-center justify-between">
          <button
            onClick={onNewSession}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>새 대화 시작</span>
          </button>
          <button 
            onClick={onClose}
            className="md:hidden ml-2 p-2 text-slate-400 hover:text-white rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
          <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            대화 목록 ({sessions.length})
          </div>

          {sessions.map(s => {
            const isActive = s.id === activeSessionId;
            const isTyping = !!typingMap[s.id];

            return (
              <div
                key={s.id}
                onClick={() => { onSelectSession(s.id); onClose(); }}
                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                  isActive 
                    ? 'bg-slate-800 text-white font-medium border border-slate-700 shadow-sm' 
                    : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {isTyping ? (
                    <div className="relative flex items-center justify-center w-3.5 h-3.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </div>
                  ) : (
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  )}
                  <span className="truncate">{s.title || '새로운 대화'}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isTyping && <span className="text-[10px] text-blue-400 font-normal shrink-0">생성중</span>}
                  <button
                    type="button"
                    onClick={(e) => onDeleteSession(s.id, e)}
                    className={`opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 text-slate-500 rounded transition-opacity ${isActive ? 'opacity-100' : ''}`}
                    title="대화방 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>동시 독립 스트리밍</span>
          <span className="font-mono">max 30</span>
        </div>
      </aside>
    </>
  );
}

