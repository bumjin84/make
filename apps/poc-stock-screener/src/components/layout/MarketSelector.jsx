import React from 'react';

export default function MarketSelector({ market, onChange }) {
  return (
    <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl shadow-inner">
      <button
        onClick={() => onChange('us')}
        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
          market === 'us'
            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-400/30'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <span className="text-base">🇺🇸</span>
        <span>미국장 (S&P 500 / 나스닥)</span>
      </button>

      <button
        onClick={() => onChange('kr')}
        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
          market === 'kr'
            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-400/30'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <span className="text-base">🇰🇷</span>
        <span>국내장 (KOSPI / 코스닥)</span>
      </button>
    </div>
  );
}
