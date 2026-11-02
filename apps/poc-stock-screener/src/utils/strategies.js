/**
 * 10대 투자 전략 정의 및 종목 부합 판정 로직 (엄격한 결측치/ETF 가드 적용)
 */

export const STRATEGIES = {
  all: {
    id: 'all',
    name: '전체 종목',
    shortName: '전체',
    icon: 'Layers',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
    description: '선별된 843개 대형·성장 및 ETF를 포함한 전체 상장 리스트',
    filter: () => true
  },
  bullish: {
    id: 'bullish',
    name: '🔥 정배열 상승추세주',
    shortName: '정배열 주도주',
    icon: 'TrendingUp',
    badgeClass: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    description: '일별 종가 기준 20일선 > 60일선 > 120일선 정배열 상태로 기관 수급이 유입 중인 초강세주',
    filter: (stock) => {
      if (!stock.trendAnalysis) return false;
      // MMF/단기금리 상품은 제외 (기술적 주가 추세가 아니므로)
      if (stock.isETF && /머니마켓|CD금리|KOFR/i.test(stock.name)) return false;
      return Boolean(stock.trendAnalysis.isBullishAlignment || stock.trendAnalysis.isShortTermBullish);
    }
  },
  buffett: {
    id: 'buffett',
    name: '👑 워런 버핏 우량주',
    shortName: '버핏 해자주',
    icon: 'Crown',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    description: '독점력과 현금창출력을 갖춘 고수익성 해자 기업 (ROE ≥ 15%, 영업이익률 ≥ 12%)',
    filter: (stock) => {
      if (stock.isETF || stock.roe === null || stock.operatingMargin === null || stock.debtRatio === null) return false;
      return stock.roe >= 15 && stock.operatingMargin >= 12 && stock.debtRatio <= 140;
    }
  },
  growth: {
    id: 'growth',
    name: '🚀 미래 고성장주',
    shortName: '고성장/혁신',
    icon: 'Rocket',
    badgeClass: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    description: '시장 컨센서스를 초과하는 압도적 이익 성장률 (차기 예상 성장률 ≥ 20%)',
    filter: (stock) => {
      if (stock.isETF || stock.consensusGrowth === null) return false;
      return stock.consensusGrowth >= 20;
    }
  },
  rateCut: {
    id: 'rateCut',
    name: '📉 금리 인하 수혜주',
    shortName: '금리인하 수혜',
    icon: 'Percent',
    badgeClass: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    description: '금리 인하 시 할인율 완화 및 이자비용 절감 수혜주 (바이오텍, 고성장 테크, 인프라)',
    filter: (stock) => {
      if (stock.isETF) return false;
      const isBioOrTech = /바이오|제약|Health|Tech|인터넷|SaaS/i.test(stock.sector || '');
      const isGrowthWithDebt = (stock.consensusGrowth || 0) >= 18 && (stock.debtRatio || 0) >= 50 && (stock.debtRatio || 0) <= 160;
      return Boolean(isBioOrTech || isGrowthWithDebt);
    }
  },
  volatility: {
    id: 'volatility',
    name: '⚡ 단기 변동성 폭발주',
    shortName: '수급·변동성',
    icon: 'Zap',
    badgeClass: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    description: '최근 3개월 주가 등락률이 크거나 20일선 이격도가 벌어지며 단기 자금이 급격히 쏠리는 롤러코스터 주식',
    filter: (stock) => {
      if (stock.isETF) return false;
      if (stock.return3M === null && !stock.trendAnalysis) return false;
      const returnAbs = Math.abs(stock.return3M || 0);
      const disparityAbs = Math.abs(stock.trendAnalysis?.disparity20 || 0);
      return returnAbs >= 15 || disparityAbs >= 5.5;
    }
  },
  garp: {
    id: 'garp',
    name: '💎 피터 린치 가치성장주',
    shortName: '피터린치 GARP',
    icon: 'Gem',
    badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    description: '성장률 대비 주가가 싼 합리적 가격의 우량주 (PEG = 선행 PER ÷ 성장률 ≤ 1.2, ROE ≥ 12%)',
    filter: (stock) => {
      if (stock.isETF || !stock.forwardPe || !stock.consensusGrowth || stock.roe === null) return false;
      const peg = stock.forwardPe / Math.max(1, stock.consensusGrowth);
      return peg <= 1.25 && stock.roe >= 12;
    }
  },
  defensive: {
    id: 'defensive',
    name: '🏰 저베타 방어 피난처',
    shortName: '경기 방어주',
    icon: 'ShieldCheck',
    badgeClass: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
    description: '불황이나 시장 급락장에서도 흔들리지 않는 탄탄한 배당과 재무안정성을 갖춘 피난처 주식',
    filter: (stock) => {
      if (stock.isETF || stock.dividendYield === null || stock.debtRatio === null) return false;
      const isDefensiveSector = /소비재|금융|전력|유틸리티|Consumer|Utilities|Financial/i.test(stock.sector || '');
      return stock.dividendYield >= 2.5 && stock.debtRatio <= 120 && isDefensiveSector;
    }
  },
  oversold: {
    id: 'oversold',
    name: '🎯 낙폭과대 바겐세일',
    shortName: '낙폭과대 반등',
    icon: 'ArrowDownCircle',
    badgeClass: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
    description: '기업 펀더멘털은 탄탄하나 시장 패닉이나 단기 악재로 52주 최고가 대비 크게 할인된 바닥 매수 후보',
    filter: (stock) => {
      if (stock.isETF || stock.priceToHigh52w === null || stock.roe === null) return false;
      return (stock.priceToHigh52w <= -14 || (stock.trendAnalysis?.disparity20 || 0) <= -2.5) && stock.roe >= 8;
    }
  },
  dividend: {
    id: 'dividend',
    name: '🛡️ 고배당 캐시카우',
    shortName: '배당 캐시카우',
    icon: 'Coins',
    badgeClass: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    description: '안정적인 현금 흐름을 창출하는 연 3.0% 이상 고배당 가치주',
    filter: (stock) => {
      if (stock.isETF || stock.dividendYield === null) return false;
      return stock.dividendYield >= 3.0;
    }
  },
  pension: {
    id: 'pension',
    name: '🏦 연금저축 추천 (과세이연)',
    shortName: '연금저축 PICK',
    icon: 'Landmark',
    badgeClass: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    description: '연금저축/IRP 계좌의 과세이연 혜택을 극대화하는 장기 복리 지수 ETF(S&P500·나스닥100) 및 우량 배당성장 자산',
    filter: (stock) => {
      if (stock.isETF) {
        return /S&P500|나스닥|배당다우존스|200|테크|반도체|채권|머니마켓|CD금리|KOFR|금현물/i.test(stock.name);
      }
      return (stock.roe || 0) >= 12 && (stock.debtRatio !== null && stock.debtRatio <= 110) && (stock.dividendYield || 0) >= 2.0;
    }
  },
  isa: {
    id: 'isa',
    name: '💼 ISA 절세 추천 (비과세)',
    shortName: 'ISA 절세 PICK',
    icon: 'Wallet',
    badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    description: '배당소득세(15.4%) 비과세 한도를 공략하는 연 3.5% 이상 고배당 우량주 및 월배당·커버드콜·해외 지수 ETF',
    filter: (stock) => {
      if (stock.isETF) {
        return /배당|커버드콜|S&P500|나스닥|고배당/i.test(stock.name);
      }
      return (stock.dividendYield || 0) >= 3.5 && (stock.debtRatio === null || stock.debtRatio <= 200);
    }
  }
};

export const STRATEGY_LIST = Object.values(STRATEGIES);

/**
 * 특정 종목이 부합하는 모든 전략 키 목록 반환
 */
export function getMatchingStrategies(stock) {
  const matches = [];
  for (const strategy of STRATEGY_LIST) {
    if (strategy.id === 'all') continue;
    if (strategy.filter(stock)) {
      matches.push(strategy.id);
    }
  }
  return matches;
}
