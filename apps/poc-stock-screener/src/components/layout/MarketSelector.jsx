import React from 'react';

export default function MarketSelector({ market, onChange, counts = {} }) {
  const tabs = [
    {
      id: 'sp500',
      flag: '🇺🇸',
      name: '미국 S&P 500',
      count: counts.sp500 || 493,
    },
    {
      id: 'kospi',
      flag: '🇰🇷',
      name: '코스피 200',
      count: counts.kospi || 200,
    },
    {
      id: 'kosdaq',
      flag: '🚀',
      name: '코스닥 150',
      count: counts.kosdaq || 150,
    }
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-inner overflow-x-auto max-w-full">
      {tabs.map((tab) => {
        const isSelected = market === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span className="text-sm sm:text-base">{tab.flag}</span>
            <span>{tab.name}</span>
            <span
              className={`text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full font-mono ${
                isSelected ? 'bg-emerald-700/80 text-emerald-100' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
