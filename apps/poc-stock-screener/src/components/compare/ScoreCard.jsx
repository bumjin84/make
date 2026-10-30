import React from 'react';
import { Trophy, CheckCircle2 } from 'lucide-react';

export default function ScoreCard({ comparisonResults }) {
  if (!comparisonResults) return null;

  const { stockA, stockB, winsA, winsB, categories } = comparisonResults;

  return (
    <div className="space-y-3">
      {/* 승패 요약 헤더 */}
      <div className="grid grid-cols-2 gap-2 text-center">
        <div
          className={`p-3 rounded-xl border transition-all ${
            winsA > winsB
              ? 'bg-emerald-950/30 border-emerald-500/40'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            {winsA > winsB && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
            <span className="font-bold text-slate-200">{stockA.name}</span>
          </div>
          <div className="mt-1">
            <span className="text-xl font-black font-mono text-emerald-400">{winsA}</span>
            <span className="text-xs text-slate-500 ml-1">승</span>
          </div>
        </div>

        <div
          className={`p-3 rounded-xl border transition-all ${
            winsB > winsA
              ? 'bg-indigo-950/30 border-indigo-500/40'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            {winsB > winsA && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
            <span className="font-bold text-slate-200">{stockB.name}</span>
          </div>
          <div className="mt-1">
            <span className="text-xl font-black font-mono text-indigo-400">{winsB}</span>
            <span className="text-xs text-slate-500 ml-1">승</span>
          </div>
        </div>
      </div>

      {/* 5대 부문별 상세 맞대결 리스트 */}
      <div className="space-y-1.5">
        {categories.map((cat, idx) => {
          const isWinnerA = cat.winner === stockA.ticker;
          const isWinnerB = cat.winner === stockB.ticker;

          return (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2 text-xs"
            >
              {/* 종목 A 수치 */}
              <div className="w-24 text-left">
                <span
                  className={`font-mono font-bold ${
                    isWinnerA ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {cat.valA}
                </span>
                {isWinnerA && <span className="ml-1 text-[10px] text-emerald-400 font-semibold">★</span>}
              </div>

              {/* 지표명 & 설명 */}
              <div className="flex-1 text-center">
                <div className="font-semibold text-slate-200">{cat.name}</div>
                <div className="text-[10px] text-slate-500 hidden sm:block">{cat.desc}</div>
              </div>

              {/* 종목 B 수치 */}
              <div className="w-24 text-right">
                {isWinnerB && <span className="mr-1 text-[10px] text-indigo-400 font-semibold">★</span>}
                <span
                  className={`font-mono font-bold ${
                    isWinnerB ? 'text-indigo-400' : 'text-slate-400'
                  }`}
                >
                  {cat.valB}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
