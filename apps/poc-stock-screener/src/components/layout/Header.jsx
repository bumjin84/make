import React from 'react';
import { TrendingUp, ArrowLeft, Clock } from 'lucide-react';
import metadata from '../../data/metadata.json';

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href="../portal/"
            className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="포털로 돌아가기"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">포털</span>
          </a>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-2">
                스마트 주식 스크리너 & 랩
                <span className="px-1.5 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-semibold">
                  PoC #5
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                워런 버핏 우량주부터 모멘텀·고성장주까지 원클릭 추천 & 1:1 맞대결 분석
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 최근 데이터 갱신 시점 뱃지 */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/90 border border-emerald-500/30 text-emerald-300 text-xs shadow-sm shadow-emerald-950/20"
            title={`수집 주기: ${metadata.cronSchedule}`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Clock className="w-3 h-3 text-emerald-400 ml-0.5" />
            <span className="font-mono text-[11px] font-medium hidden sm:inline">기준:</span>
            <span className="font-mono text-[11px] font-bold text-white">
              {metadata.lastUpdated || '최신'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
