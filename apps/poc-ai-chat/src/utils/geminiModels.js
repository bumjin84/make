export const GEMINI_MODELS = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    shortName: '2.5 Flash',
    badge: '무료 추천',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    description: '최신 플래시 모델, 초고속 속도와 멀티모달 균형 (무료 티어 지원)'
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    shortName: '2.0 Flash',
    badge: '무료 초고속',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    description: '차세대 실시간 스트리밍 및 초저지연 응답 속도 (무료 티어 지원)'
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    shortName: '1.5 Flash',
    badge: '무료 경량화',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    description: '가볍고 빠른 범용 일상 대화 모델 (무료 티어 지원)'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    shortName: '1.5 Pro',
    badge: '무료 대규모',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    description: '200만 토큰 대규모 컨텍스트 및 복합 문서 분석 (무료 티어 지원)'
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro (Preview)',
    shortName: '3.1 Pro',
    badge: '유료 전용',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    description: '차세대 플래그십 심층 추론 (무료 티어 미지원, 유료/종량제 계정 전용)'
  }
];

export const DEFAULT_MODEL = 'gemini-2.5-flash';

export function getModelInfo(modelId) {
  if (modelId === 'gemini-2.5-pro') {
    return GEMINI_MODELS.find(m => m.id === 'gemini-3.1-pro-preview') || GEMINI_MODELS[0];
  }
  return GEMINI_MODELS.find(m => m.id === modelId) || GEMINI_MODELS[0];
}
