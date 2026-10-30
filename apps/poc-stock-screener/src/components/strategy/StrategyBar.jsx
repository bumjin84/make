import React from 'react';
import { Layers, Crown, Rocket, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';
import { STRATEGY_LIST, STRATEGIES } from '../../utils/strategies';

const iconMap = {
  Layers,
  Crown,
  Rocket,
  TrendingUp,
  ShieldCheck
};

export default function StrategyBar({ selectedStrategy, onSelectStrategy, filteredCount }) {
  const currentStrategy = STRATEGIES[selectedStrategy] || STRATEGIES.all;

  return (
    <div className="space-y-3">
      {/* 전략 필터 탭 버튼 가로 스크롤 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STRATEGY_LIST.map((strategy) => {
          const Icon = iconMap[strategy.icon];
          const isSelected = selectedStrategy === strategy.id;

          return (
            <button
              key={strategy.id}
              onClick={() => onSelectStrategy(strategy.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap border transition-all ${
                isSelected
                  ? 'bg-slate-100 text-slate-900 border-white shadow-md shadow-white/10'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {Icon && <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-900' : 'text-slate-400'}`} />}
              <span>{strategy.name}</span>
            </button>
          );
        })}
      </div>

      {/* 선택된 전략의 투자 철학 및 핵심 기준 하이라이트 배너 */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <span>{currentStrategy.name} 발굴 조건</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {currentStrategy.description}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs text-slate-400">발굴된 종목: </span>
          <span className="text-xs font-bold text-emerald-400">{filteredCount}개</span>
        </div>
      </div>
    </div>
  );
}
