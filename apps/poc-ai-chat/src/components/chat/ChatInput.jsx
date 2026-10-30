import React, { useState } from 'react';
import { Key, Send, AlertCircle } from 'lucide-react';

export default function ChatInput({
  isTyping,
  hasKey,
  sessionTitle,
  errorMessage,
  onOpenKeyModal,
  onSendMessage
}) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <footer className="shrink-0 p-3 sm:p-4 bg-slate-900/95 border-t border-slate-800 max-w-3xl w-full mx-auto">
      {errorMessage && (
        <div className="mb-2.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenKeyModal}
          className={`p-3 rounded-xl border transition-colors shrink-0 active:scale-95 ${
            hasKey 
              ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-emerald-500/30' 
              : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-amber-500/30'
          }`}
          title="Gemini API Key 설정"
        >
          <Key className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
          placeholder={
            isTyping 
              ? "답변을 생성하는 중입니다..." 
              : hasKey 
                ? `[${sessionTitle}]에 질문하기...` 
                : "질문을 입력하세요 (키 미등록 시 Mock)"
          }
          className="flex-1 bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm rounded-xl px-3.5 py-3 focus:outline-none focus:border-blue-500 placeholder:text-slate-500 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white p-3 rounded-xl transition-all shrink-0 active:scale-95 shadow-md shadow-blue-600/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </footer>
  );
}
