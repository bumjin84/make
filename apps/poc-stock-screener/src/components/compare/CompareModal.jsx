import React, { useEffect } from 'react';
import { X, ArrowLeft, Swords } from 'lucide-react';
import ScoreCard from './ScoreCard';
import ReturnLineChart from './ReturnLineChart';

export default function CompareModal({
  isOpen,
  comparisonResults,
  onClose,
  onClear
}) {
  // ESC 키 입력 시 모달 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !comparisonResults) return null;

  const { stockA, stockB, chartData } = comparisonResults;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm md:p-6 animate-in fade-in duration-150">
      {/* 바깥쪽 클릭 시 닫기 (PC 전용 배경) */}
      <div
        className="hidden md:block absolute inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 메인 모달 창: PC는 중앙 정렬 팝업, 모바일은 화면 100% 풀스크린 */}
      <div className="w-full h-dvh md:h-auto md:max-h-[90vh] md:max-w-5xl bg-slate-900 md:border md:border-slate-700/80 shadow-2xl md:rounded-3xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* 상단 통합 헤더 바 */}
        <div className="px-4 md:px-6 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            {/* 모바일에서는 뒤로가기 아이콘, PC에서는 맞대결 아이콘 */}
            <button
              onClick={onClose}
              className="md:hidden p-1.5 -ml-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="뒤로가기"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="hidden md:flex p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Swords className="w-4 h-4" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm md:text-base font-bold text-white flex items-center gap-1.5">
                  <span>1:1 맞대결 비교 분석</span>
                </h2>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {stockA.ticker} vs {stockB.ticker}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                수익성·성장성·밸류에이션·정배열 추세 5개 부문 매력도 및 60일 수익률 궤적 비교
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              className="px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors hidden sm:block"
            >
              선택 초기화
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="닫기 (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 바디 영역: PC는 2컬럼 그리드, 모바일은 1컬럼 스크롤 */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
            {/* 좌측: Recharts 60일 정규화 수익률 궤적 차트 */}
            <div className="space-y-2">
              <ReturnLineChart
                chartData={chartData}
                stockA={stockA}
                stockB={stockB}
              />
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-[11px] text-slate-400">
                💡 <strong className="text-slate-300">기준 100 정규화 차트:</strong> 서로 다른 주가를 가진 두 종목의 최근 60영업일 실제 주가 흐름을 시작점 100 기준으로 환산하여 비교한 상대 수익률 궤적입니다.
              </div>
            </div>

            {/* 우측: 5대 부문별 승자 스코어카드 & 정배열 상태 */}
            <div>
              <ScoreCard comparisonResults={comparisonResults} />
            </div>
          </div>
        </div>

        {/* 모바일 전용 하단 액션 바 */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between md:hidden shrink-0">
          <button
            onClick={onClear}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-rose-400 font-semibold"
          >
            선택 초기화
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-bold transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
