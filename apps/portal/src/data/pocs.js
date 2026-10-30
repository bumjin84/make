import { Bot, Box, FileText, TrendingUp } from 'lucide-react';

export const POCS = [
  {
    id: 'poc-stock-screener',
    title: 'Stock Screener & Compare',
    summary: '워런 버핏 우량주, 고성장주, 추세주 4대 전략 원클릭 추천 및 1:1 맞대결 정규화 수익률 비교 랩',
    status: 'In Development',
    statusColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    tags: ['React 19', 'Recharts', '4 Strategies', 'Compare Drawer'],
    path: './poc-stock-screener/',
    icon: TrendingUp,
    accent: 'from-amber-500 to-rose-600'
  },
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
    statusColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    tags: ['Vanilla JS', 'Marked.js', 'Theme Switcher', 'Export HTML/MD'],
    path: './poc-markdown/',
    icon: FileText,
    accent: 'from-purple-600 to-pink-600'
  }
];
