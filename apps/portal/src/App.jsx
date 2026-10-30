import React, { useState } from 'react';
import { 
  Bot, 
  Box, 
  FileText, 
  ExternalLink, 
  Terminal, 
  Sparkles, 
  FolderGit2, 
  Layers,
  ChevronRight,
  Calendar,
  Tag
} from 'lucide-react';

const POCS = [
  {
    id: 'poc-ai-chat',
    title: 'AI Chat Interface',
    summary: '실시간 토큰 스트리밍과 모바일 가상 키보드 최적화가 적용된 대화형 챗봇 UI',
    status: 'In Progress',
    statusColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    tags: ['React', 'Tailwind', 'AI UI', 'Mobile dvh'],
    path: './poc-ai-chat/',
    icon: Bot,
    accent: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'poc-3d-scene',
    title: '3D Scene Lab',
    summary: 'Three.js 기반의 터치 제스처(회전/핀치줌) 반응형 WebGL 3D 인터랙션 랩',
    status: 'In Progress',
    statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    tags: ['Three.js', 'WebGL', 'Touch Controls', 'Vite'],
    path: './poc-3d-scene/',
    icon: Box,
    accent: 'from-emerald-600 to-teal-600'
  },
  {
    id: 'poc-markdown',
    title: 'Markdown Studio',
    summary: '데스크톱 스플릿 뷰 및 모바일 탭 전환 지원 경량 실시간 마크다운 파서 & 뷰어',
    status: 'In Progress',
    statusColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    tags: ['Vanilla JS', 'Marked.js', 'Adaptive Tab', 'GFM'],
    path: './poc-markdown/',
    icon: FileText,
    accent: 'from-purple-600 to-pink-600'
  }
];

const ARCHIVES = [
  {
    date: '2026.10',
    category: 'Architecture',
    title: 'Monorepo & Multi-App 기반 PoC 테스트베드 아키텍처 수립',
    desc: 'pnpm Workspaces와 Vite를 연계하여 독립 빌드와 통합 GitHub Pages 서빙 파이프라인 설계'
  },
  {
    date: '2026.10',
    category: 'DevOps',
    title: 'GitHub CLI 연동 및 자동화 파이프라인 구성',
    desc: '인증 토큰 및 Git Credential Helper 설정을 통한 원클릭 리포지토리 자동 생성 및 푸시 구축'
  },
  {
    date: '2026.10',
    category: 'Core',
    title: 'Mobile-First & 전면 반응형 설계 원칙 적용',
    desc: '모바일 뷰포트(dvh), 터치 제스처, 적응형 탭 레이아웃을 전 PoC 기본 사양으로 표준화'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-850 border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight">Make Lab</h1>
          </div>
        </div>

        <nav className="flex items-center gap-2 sm:gap-4">
          <a 
            href="#pocs" 
            className="text-xs sm:text-sm text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            PoC Lab
          </a>
          <a 
            href="#archives" 
            className="text-xs sm:text-sm text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            Archives
          </a>
          <a 
            href="https://github.com/bumjin84/make" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-750 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
        {/* Hero Section */}
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

        {/* PoC Playground Section */}
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

          {/* Cards Grid: Mobile 1-col, Tablet 2-col, Desktop 3-col */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

        {/* Work Archive Section */}
        <section id="archives" className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>📚 Work Archives</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              플랫폼 개발 및 연구 작업 내역 타임라인입니다.
            </p>
          </div>

          <div className="space-y-3">
            {ARCHIVES.map((item, idx) => (
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
                  <p className="text-xs sm:text-sm text-slate-400">
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
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-850 border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500">
        <p>© 2026 Park Beom Jin. Built with Vite, pnpm Workspaces & Tailwind CSS.</p>
      </footer>
    </div>
  );
}

