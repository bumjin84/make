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
    summary: '실시간 토큰 스트리밍과 모바일 가상 키보드 최적화, 독립 멀티 세션 대화방이 적용된 Gemini 챗봇 UI',
    status: 'Active (Live)',
    statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    tags: ['React', 'Gemini 2.5', 'Multi-Session', 'Mobile dvh'],
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
    summary: '4종 프리미엄 테마(GitHub, Notion, Academic) 실시간 스위칭 및 독립 실행형 HTML/MD 파일 내보내기 랩',
    status: 'Active (Live)',
    statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    tags: ['Vanilla JS', 'Marked.js', 'Theme Switcher', 'Export HTML/MD'],
    path: './poc-markdown/',
    icon: FileText,
    accent: 'from-purple-600 to-pink-600'
  }
];

// 실제 깃 배포 및 개발 내역 아카이브
const ARCHIVES = [
  {
    date: '2026.10.30',
    category: 'Markdown Lab',
    title: '4종 프리미엄 테마 스위처 및 독립형 HTML/MD 내보내기 구현',
    desc: 'GitHub Dark/Light, Notion Clean, Academic Sepia 실시간 전환 및 CSS 인라인 내장형 독립 HTML 다운로드 파이프라인 개발'
  },
  {
    date: '2026.10.30',
    category: 'AI Lab',
    title: '세션별 독립 동시 스트리밍 및 백그라운드 답변 생성 지원',
    desc: '전역 락을 해제하고 세션별 타이핑 맵을 분리하여 대화방 1 생성 중 대화방 2에서 동시 질문 작업 가능'
  },
  {
    date: '2026.10.30',
    category: 'AI Lab',
    title: '멀티 세션(대화방 관리) 시스템 및 문맥 격리 아키텍처 구현',
    desc: '세션별 독립 대화방 개설, 첫 질문 기반 자동 제목 생성, 세션당 최신 30개 메시지 롤링 및 문맥 완벽 격리'
  },
  {
    date: '2026.10.30',
    category: 'AI Lab',
    title: 'Google Gemini 2.5 Flash 실시간 스트리밍 & API Key 매니저 도입',
    desc: '정적 클라이언트 환경에서 브라우저 직접 fetch 기반 SSE 스트리밍 구현 및 localStorage 보안 키 매니저 연동'
  },
  {
    date: '2026.10.30',
    category: 'DevOps',
    title: 'paths-filter 기반 스마트 부분 빌드(Incremental Build) 파이프라인 구축',
    desc: '수정된 앱만 30초 내로 단독 빌드하고, 나머지 사이트는 이전 캐시를 재사용하는 초고속 CI/CD 배포 구성'
  },
  {
    date: '2026.10.30',
    category: 'Architecture',
    title: 'Vite + pnpm Workspaces 기반 모노레포 구축 & 4개 독립 앱 스캐폴딩',
    desc: '포털 및 3개의 독립 PoC(AI Chat, 3D Scene, Markdown)를 완벽히 격리된 멀티 앱 구조로 번들링'
  },
  {
    date: '2026.10.30',
    category: 'Core',
    title: '모바일 퍼스트(Mobile-First) & 전면 반응형 설계 원칙 확립',
    desc: '동적 뷰포트(dvh), 모바일 터치 제스처, 적응형 탭 레이아웃을 모든 사이트의 기본 사양으로 표준화'
  }
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = ['ALL', 'Markdown Lab', 'AI Lab', 'DevOps', 'Architecture', 'Core'];

  const filteredArchives = activeCategory === 'ALL' 
    ? ARCHIVES 
    : ARCHIVES.filter(a => a.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
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

          {/* Cards Grid */}
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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>📚 Work Archives</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                깃 배포와 함께 지속적으로 누적되는 개발 및 연구 기록입니다.
              </p>
            </div>

            {/* Category Filter Chips */}
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
            {filteredArchives.map((item, idx) => (
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
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500">
        <p>© 2026 Park Beom Jin. Built with Vite, pnpm Workspaces & Tailwind CSS.</p>
      </footer>
    </div>
  );
}
