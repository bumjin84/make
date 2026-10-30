import React from 'react';
import { ExternalLink } from 'lucide-react';
import { POCS } from '../../data/pocs';

export default function PocGrid() {
  return (
    <section id="pocs" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>🧪 PoC Playground</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            독립적인 기술 스택으로 빌드된 개별 실험용 샌드박스입니다.
          </p>
        </div>
        <span className="text-xs text-slate-500 font-mono">Total {POCS.length} Sandboxes</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {POCS.map((poc) => {
          const Icon = poc.icon;
          return (
            <div 
              key={poc.id}
              className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/90 border border-slate-800 p-6 hover:border-slate-700 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${poc.accent} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${poc.statusColor}`}>
                    {poc.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {poc.title}
                  </h4>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed">
                    {poc.summary}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {poc.tags.map((t) => (
                    <span key={t} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-750">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-800/80">
                <a
                  href={poc.path}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
                >
                  <span>실험실 열기 (Launch)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
