/**
 * 4대 투자 전략 정의 및 종목 부합 판정 로직
 */

export const STRATEGIES = {
  all: {
    id: 'all',
    name: '전체 종목',
    shortName: '전체',
    icon: 'Layers',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
    description: '선별된 30개 우량 핵심 종목 전체 리스트',
    filter: () => true
  },
  bullish: {
    id: 'bullish',
    name: '🔥 정배열 상승추세주',
    shortName: '정배열 주도주',
    icon: 'TrendingUp',
    badgeClass: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    description: '일별 종가 기준 20일선 > 60일선 > 120일선 정배열 상태로 기관 수급이 유입 중인 초강세주',
    filter: (stock) => (stock.trendAnalysis?.isBullishAlignment || stock.trendAnalysis?.isShortTermBullish)
  },
  buffett: {
    id: 'buffett',
    name: '워런 버핏 우량주',
    shortName: '버핏 해자주',
    icon: 'Crown',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    description: '독점력과 현금창출력을 갖춘 고수익성 해자 기업 (ROE ≥ 15%, 영업이익률 ≥ 15%)',
    filter: (stock) => (stock.roe >= 15 && stock.operatingMargin >= 14 && stock.debtRatio <= 130)
  },
  growth: {
    id: 'growth',
    name: '미래 고성장주',
    shortName: '고성장/혁신',
    icon: 'Rocket',
    badgeClass: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    description: '시장 컨센서스를 초과하는 압도적 이익 성장률 (차기 예상 성장률 ≥ 20%)',
    filter: (stock) => (stock.consensusGrowth >= 20)
  },
  momentum: {
    id: 'momentum',
    name: '추세 모멘텀주',
    shortName: '신고가 추세',
    icon: 'TrendingUp',
    badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    description: '기관 수급 유입 및 52주 신고가 근접 강한 상승 탄력 (3M 수익률 ≥ 10%, 신고가 -10% 이내)',
    filter: (stock) => (stock.return3M >= 10 && stock.priceToHigh52w >= -10)
  },
  dividend: {
    id: 'dividend',
    name: '고배당 캐시카우',
    shortName: '배당 방어주',
    icon: 'ShieldCheck',
    badgeClass: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
    description: '하락장에서도 든든한 현금 흐름을 주는 방어형 고배당주 (배당수익률 ≥ 3.0%)',
    filter: (stock) => (stock.dividendYield >= 3.0)
  }
};

export const STRATEGY_LIST = Object.values(STRATEGIES);

/**
 * 특정 종목이 부합하는 모든 전략 키 목록 반환
 */
export function getMatchingStrategies(stock) {
  const matches = [];
  if (STRATEGIES.bullish.filter(stock)) matches.push('bullish');
  if (STRATEGIES.buffett.filter(stock)) matches.push('buffett');
  if (STRATEGIES.growth.filter(stock)) matches.push('growth');
  if (STRATEGIES.momentum.filter(stock)) matches.push('momentum');
  if (STRATEGIES.dividend.filter(stock)) matches.push('dividend');
  return matches;
}

