import React from 'react';
import { Check, ArrowUpDown } from 'lucide-react';
import { formatPrice, formatPercent, formatMultiple, getReturnColorClass } from '../../utils/formatters';
import StrategyBadge from '../strategy/StrategyBadge';

export default function StockTable({
  stocks,
  selectedTickers,
  onToggleCompare,
  market,
  sortBy,
  onSortChange
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-900/90 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800 font-semibold">
          <tr>
            <th className="py-3 px-3 w-14 text-center">비교</th>
            <th className="py-3 px-3">종목명 / 티커</th>
            <th className="py-3 px-3">현재가</th>
            <th
              className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
              onClick={() => onSortChange('return3M')}
            >
              <div className="flex items-center gap-1">
                <span>3M 수익률</span>
                <ArrowUpDown className="w-3 h-3 text-slate-500" />
              </div>
            </th>
            <th
              className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
              onClick={() => onSortChange('forwardPe')}
            >
              <div className="flex items-center gap-1">
                <span>선행 PER</span>
                <ArrowUpDown className="w-3 h-3 text-slate-500" />
              </div>
            </th>
            <th
              className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
              onClick={() => onSortChange('roe')}
            >
              <div className="flex items-center gap-1">
                <span>ROE</span>
                <ArrowUpDown className="w-3 h-3 text-slate-500" />
              </div>
            </th>
            <th
              className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
              onClick={() => onSortChange('dividendYield')}
            >
              <div className="flex items-center gap-1">
                <span>배당률</span>
                <ArrowUpDown className="w-3 h-3 text-slate-500" />
              </div>
            </th>
            <th className="py-3 px-3">부합 전략</th>
            <th className="py-3 px-3 min-w-[220px]">추천 사유 요약</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {stocks.map((stock) => {
            const isCompared = selectedTickers.includes(stock.ticker);

            return (
              <tr
                key={stock.ticker}
                className={`transition-colors ${
                  isCompared
                    ? 'bg-emerald-950/25 hover:bg-emerald-950/40'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                {/* 비교 선택 버튼 */}
                <td className="py-3 px-3 text-center">
                  <button
                    onClick={() => onToggleCompare(stock.ticker)}
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-all mx-auto ${
                      isCompared
                        ? 'bg-emerald-500 text-white border-emerald-400'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-500'
                    }`}
                    title="1:1 맞대결 담기"
                  >
                    {isCompared && <Check className="w-3.5 h-3.5" />}
                  </button>
                </td>

                {/* 종목 및 티커 */}
                <td className="py-3 px-3">
                  <div>
                    <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                      <span>{stock.name}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[10px] text-emerald-400 font-bold">{stock.ticker}</span>
                      <span className="text-[10px] text-slate-500">{stock.sector}</span>
                    </div>
                  </div>
                </td>

                {/* 현재가 */}
                <td className="py-3 px-3 font-mono font-semibold text-white whitespace-nowrap">
                  <div>{formatPrice(stock.price, market)}</div>
                  <div className="text-[10px] text-slate-500 font-normal">{stock.marketCap}</div>
                </td>

                {/* 3M 수익률 */}
                <td className="py-3 px-3 font-mono font-bold whitespace-nowrap">
                  <span className={getReturnColorClass(stock.return3M)}>
                    {formatPercent(stock.return3M)}
                  </span>
                </td>

                {/* 선행 PER */}
                <td className="py-3 px-3 font-mono text-slate-200 whitespace-nowrap">
                  {formatMultiple(stock.forwardPe)}
                </td>

                {/* ROE */}
                <td className="py-3 px-3 font-mono text-slate-200 whitespace-nowrap">
                  {stock.roe.toFixed(1)}%
                </td>

                {/* 배당수익률 */}
                <td className="py-3 px-3 font-mono text-slate-200 whitespace-nowrap">
                  {stock.dividendYield > 0 ? `${stock.dividendYield.toFixed(2)}%` : '-'}
                </td>

                {/* 부합 전략 태그 */}
                <td className="py-3 px-3">
                  <div className="flex flex-wrap gap-1 max-w-[160px]">
                    {stock.matchedStrategies.map((key) => (
                      <StrategyBadge key={key} strategyKey={key} />
                    ))}
                  </div>
                </td>

                {/* 추천 사유 한 줄 요약 */}
                <td className="py-3 px-3 text-[11px] text-slate-400 leading-relaxed">
                  {stock.reasoning}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
