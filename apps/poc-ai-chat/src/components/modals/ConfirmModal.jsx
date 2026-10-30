import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onConfirmReset,
  onConfirmKeep
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3.5">
        <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
          <HelpCircle className="w-5 h-5 shrink-0" />
          <span>API Key가 변경되었습니다</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          새로운 API Key가 감지되었습니다. 모든 대화방(세션)을 초기화하고 새로 시작할까요, 아니면 대화방들을 유지할까요?
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={onConfirmReset}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
          >
            모든 대화방 초기화 후 저장
          </button>
          <button
            type="button"
            onClick={onConfirmKeep}
            className="w-full py-2 px-3 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            대화방 유지하고 저장
          </button>
        </div>
      </div>
    </div>
  );
}

