import React, { useState } from 'react';
import { Key, X, ExternalLink, Eye, EyeOff, ShieldCheck, Trash2 } from 'lucide-react';

export default function KeyModal({
  isOpen,
  onClose,
  apiKey,
  tempKey,
  onChangeTempKey,
  onSaveKey,
  onRemoveKey
}) {
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
            <Key className="w-4 h-4 text-blue-400" />
            <span>Google Gemini API Key 설정</span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Gemini API Key</span>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              className="text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>키 무료 발급</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={tempKey}
              onChange={(e) => onChangeTempKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white pr-10 focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] leading-relaxed">
            <ShieldCheck className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
            <p>
              키는 외부 서버로 전송되지 않고 브라우저 <strong>localStorage</strong>에만 보관됩니다.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {apiKey ? (
            <button
              type="button"
              onClick={onRemoveKey}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>키 삭제</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onSaveKey}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
            >
              저장 및 적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
