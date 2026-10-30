import React from 'react';
import { Sparkles, FolderGit2, Terminal, Layers } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-10 lg:p-12 shadow-2xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 max-w-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multi-App Monorepo Platform</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Work Archive &<br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300">
            PoC Testbed Playground
          </span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          독립적인 웹 기술 스택을 자유롭게 실험하고, 개발 기록을 체계적으로 아카이빙하는 공간입니다. 
          모든 사이트는 모바일과 데스크톱 환경에 완벽하게 반응합니다.
        </p>

        <div className="pt-2 flex flex-wrap gap-4 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-1.5">
            <FolderGit2 className="w-4 h-4 text-blue-400" />
            <span>pnpm Workspaces</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Vite Multi-Build</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Mobile-First Responsive</span>
          </div>
        </div>
      </div>
    </section>
  );
}

