import React, { useState } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { ARCHIVES } from '../../data/archives';
import { filterArchives } from '../../utils/filterArchives';

export default function ArchiveSection() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const categories = ['ALL', 'Architecture', 'AI Lab', 'Markdown Lab', 'DevOps'];
  const filtered = filterArchives(ARCHIVES, activeCategory);

  return (
    <section id="archives" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>📚 Work Archives</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            깃 배포와 함께 지속적으로 누적되는 개발 및 연구 기록입니다.
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors shrink-0 ${
                activeCategory === cat
                  ? 'bg-blue-600 border-blue-500 text-white font-medium'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((item, idx) => (
          <div 
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:bg-slate-900 transition-colors"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {item.category}
                </span>
                <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.date}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-white">
                {item.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
            <div className="hidden sm:block text-slate-600">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

