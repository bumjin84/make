import React from 'react';
import { Swords, X, Sparkles, ArrowRight } from 'lucide-react';

export default function ComparePill({
  comparedStocks,
  onOpenModal,
  onClear
}) {
  if (comparedStocks.length === 0) return null;

  // 1개만 선택되었을 때의 안내 칩
  if (comparedStocks.length === 1) {
    const stock = comparedStocks[0];
    return (
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl rounded-full px-4 py-2.5 flex items-center justify-between gap-3 text-xs animate-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="font-semibold text-slate-200 truncate">
            <strong className="text-emerald-400 font-bold">{stock.name}</strong> 담김
          </span>
          <span className="text-[11px] text-slate-400 truncate">
            (1개 더 선택 시 맞대결)
          </span>
        </div>
        <button
          onClick={onClear}
          className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors shrink-0"
          title="비교 취소"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // 2개 모두 선택되었을 때의 맞대결 런처 칩
  const [stockA, stockB] = comparedStocks;
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-lg bg-slate-900/95 backdrop-blur-md border border-emerald-500/50 shadow-2xl shadow-emerald-950/50 rounded-full p-1.5 pl-4 flex items-center justify-between gap-2 text-xs animate-in slide-in-from-bottom-4 duration-200">
      <button
        onClick={onOpenModal}
        className="flex-1 flex items-center justify-between gap-2 text-left group overflow-hidden py-1"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
            <Swords className="w-3.5 h-3.5" />
          </span>
          <div className="truncate">
            <span className="font-bold text-white group-hover:text-emerald-300 transition-colors">
              {stockA.name} <span className="text-slate-500 font-normal">vs</span> {stockB.name}
            </span>
            <span className="text-[10px] text-emerald-400 block font-medium">
              1:1 맞대결 분석 팝업 열기
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-600 group-hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-colors shrink-0">
          <span>열기</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </button>

      <div className="h-6 w-px bg-slate-800 shrink-0" />

      <button
        onClick={onClear}
        className="p-2 text-slate-400 hover:text-rose-400 rounded-full hover:bg-slate-800 transition-colors shrink-0"
        title="비교 초기화"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

