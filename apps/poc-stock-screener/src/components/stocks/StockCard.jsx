import React from 'react';
import { Check, Lightbulb } from 'lucide-react';
import { formatPrice, formatPercent, getReturnColorClass } from '../../utils/formatters';
import StrategyBadge from '../strategy/StrategyBadge';
import MetricBadge from './MetricBadge';

export default function StockCard({ stock, isCompared, onToggleCompare, market }) {
  return (
    <div
      className={`relative rounded-2xl border transition-all p-4 flex flex-col justify-between ${
        isCompared
          ? 'bg-emerald-950/20 border-emerald-500/50 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/30'
          : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
      }`}
    >
      <div>
        {/* 상단: 티커 & 비교 선택 체크박스 */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-white tracking-wide">{stock.ticker}</span>
              <span className="text-[11px] text-slate-400 truncate">{stock.sector}</span>
            </div>
            <h3 className="text-sm font-semibold text-slate-200 truncate mt-0.5" title={stock.name}>
              {stock.name}
            </h3>
          </div>

          <button
            onClick={() => onToggleCompare(stock.ticker)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              isCompared
                ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm shadow-emerald-500/40'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200 hover:border-slate-600'
            }`}
            title="1:1 맞대결 비교함에 담기 (최대 2개)"
          >
            {isCompared ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{isCompared ? '비교 중' : '비교 담기'}</span>
          </button>
        </div>

        {/* 현재가 및 시가총액 */}
        <div className="flex items-baseline justify-between py-2 border-y border-slate-800/60 my-2">
          <div>
            <span className="text-base font-bold font-mono text-white">
              {formatPrice(stock.price, market)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-mono">시총 {stock.marketCap}</span>
          </div>
        </div>

        {/* 핵심 4대 지표 그리드 */}
        <div className="grid grid-cols-4 gap-2 py-2">
          <MetricBadge label="3M 수익률" value={stock.return3M} type="percent" />
          <MetricBadge label="선행 PER" value={stock.forwardPe} type="multiple" />
          <MetricBadge label="ROE" value={stock.roe} type="ratio" />
          <MetricBadge label="배당률" value={stock.dividendYield} type="ratio" />
        </div>

        {/* 정배열 추세 분석 (Daily Moving Averages) */}
        {stock.trendAnalysis && (
          <div className="my-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-300">
                {stock.trendAnalysis.trendStatus}
              </span>
            </div>
            <div className="font-mono text-slate-400 text-[10px] space-x-1.5">
              <span>MA20: <strong className="text-slate-200">{formatPrice(stock.trendAnalysis.ma20, market)}</strong></span>
              <span>MA60: <strong className="text-slate-200">{formatPrice(stock.trendAnalysis.ma60, market)}</strong></span>
            </div>
          </div>
        )}

        {/* 부합 전략 뱃지 목록 */}
        {stock.matchedStrategies && stock.matchedStrategies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {stock.matchedStrategies.map((key) => (
              <StrategyBadge key={key} strategyKey={key} />
            ))}
          </div>
        )}
      </div>

      {/* 추천 사유 한 줄 요약 💡 */}
      <div className="mt-3 pt-3 border-t border-slate-800/70">
        <div className="flex items-start gap-1.5 p-2 rounded-lg bg-slate-950/40 border border-slate-800/40">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
            {stock.reasoning}
          </p>
        </div>
      </div>
    </div>
  );
}

