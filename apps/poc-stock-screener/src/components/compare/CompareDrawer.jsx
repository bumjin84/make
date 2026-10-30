import React, { useState } from 'react';
import { ChevronUp, ChevronDown, X, Swords } from 'lucide-react';
import ScoreCard from './ScoreCard';
import ReturnLineChart from './ReturnLineChart';

export default function CompareDrawer({
  comparedStocks,
  comparisonResults,
  onClear,
  onRemoveTicker
}) {
  const [isOpen, setIsOpen] = useState(true);

  if (comparedStocks.length === 0) return null;

  // 1개만 선택되었을 때의 미니 알림 바
  if (comparedStocks.length === 1) {
    const stock = comparedStocks[0];
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg bg-slate-900 border border-emerald-500/50 shadow-2xl rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold">
            <Swords className="w-4 h-4" />
          </span>
          <div>
            <div className="font-semibold text-white">
              <span className="text-emerald-400 font-bold">{stock.name}</span> 선택됨
            </div>
            <div className="text-[11px] text-slate-400">비교할 두 번째 종목을 목록에서 선택해주세요 (1/2)</div>
          </div>
        </div>
        <button
          onClick={onClear}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="비교 취소"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // 2개 모두 선택되었을 때의 1:1 맞대결 분석 랩
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div className="w-full max-w-5xl bg-slate-900/95 backdrop-blur-xl border-t border-x border-slate-700/80 shadow-2xl rounded-t-3xl overflow-hidden">
        {/* 헤더 바 */}
        <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                1:1 맞대결 비교 분석
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {comparedStocks[0].name} vs {comparedStocks[1].name}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors text-xs flex items-center gap-1"
            >
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              <span className="hidden sm:inline">{isOpen ? '접기' : '펼치기'}</span>
            </button>
            <button
              onClick={onClear}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
              title="비교 종료"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 바디 영역 (접고 펼치기 지원) */}
        {isOpen && (
          <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* 좌측: 정규화 수익률 궤적 차트 */}
              <div>
                <ReturnLineChart
                  chartData={comparisonResults.chartData}
                  stockA={comparisonResults.stockA}
                  stockB={comparisonResults.stockB}
                />
              </div>

              {/* 우측: 5대 지표별 스코어카드 */}
              <div>
                <ScoreCard comparisonResults={comparisonResults} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

