import { useState, useMemo } from 'react';

export function useStockCompare(stocks) {
  const [selectedTickers, setSelectedTickers] = useState([]);

  const toggleStock = (ticker) => {
    setSelectedTickers(prev => {
      if (prev.includes(ticker)) {
        return prev.filter(t => t !== ticker);
      }
      if (prev.length >= 2) {
        // 이미 2개가 차있으면 두 번째 것을 교체하거나 새로 추가
        return [prev[1], ticker];
      }
      return [...prev, ticker];
    });
  };

  const clearCompare = () => setSelectedTickers([]);

  const comparedStocks = useMemo(() => {
    return selectedTickers
      .map(t => stocks.find(s => s.ticker === t))
      .filter(Boolean);
  }, [selectedTickers, stocks]);

  // 맞대결 점수 및 승패 계산
  const comparisonResults = useMemo(() => {
    if (comparedStocks.length < 2) return null;
    const [a, b] = comparedStocks;

    const categories = [
      {
        name: '수익성 (ROE)',
        valA: `${a.roe.toFixed(1)}%`,
        valB: `${b.roe.toFixed(1)}%`,
        winner: a.roe > b.roe ? a.ticker : b.roe > a.roe ? b.ticker : 'draw',
        desc: '자본 투입 대비 순이익 창출 효율성'
      },
      {
        name: '미래 성장성 (컨센서스)',
        valA: `+${a.consensusGrowth.toFixed(1)}%`,
        valB: `+${b.consensusGrowth.toFixed(1)}%`,
        winner: a.consensusGrowth > b.consensusGrowth ? a.ticker : b.consensusGrowth > a.consensusGrowth ? b.ticker : 'draw',
        desc: '차기 예상 영업이익 성장 탄력도'
      },
      {
        name: '밸류에이션 (선행 PER)',
        valA: `${a.forwardPe.toFixed(1)}배`,
        valB: `${b.forwardPe.toFixed(1)}배`,
        winner: a.forwardPe < b.forwardPe ? a.ticker : b.forwardPe < a.forwardPe ? b.ticker : 'draw',
        desc: '예상 실적 대비 주가 부담도 (낮을수록 저평가)'
      },
      {
        name: '배당 환원 (배당수익률)',
        valA: `${a.dividendYield.toFixed(2)}%`,
        valB: `${b.dividendYield.toFixed(2)}%`,
        winner: a.dividendYield > b.dividendYield ? a.ticker : b.dividendYield > a.dividendYield ? b.ticker : 'draw',
        desc: '연간 주당 배당금의 현금 환원 매력도'
      },
      {
        name: '단기 모멘텀 (3개월 수익률)',
        valA: `${a.return3M > 0 ? '+' : ''}${a.return3M.toFixed(1)}%`,
        valB: `${b.return3M > 0 ? '+' : ''}${b.return3M.toFixed(1)}%`,
        winner: a.return3M > b.return3M ? a.ticker : b.return3M > a.return3M ? b.ticker : 'draw',
        desc: '최근 3개월 시장 자금 유입 및 주가 탄력'
      }
    ];

    const winsA = categories.filter(c => c.winner === a.ticker).length;
    const winsB = categories.filter(c => c.winner === b.ticker).length;

    // 차트용 정규화 궤적 데이터 (6개 포인트)
    const labels = ['3M 전', '2.5M 전', '2M 전', '1.5M 전', '1M 전', '현재'];
    const chartData = labels.map((label, idx) => ({
      date: label,
      [a.ticker]: a.sparkline ? a.sparkline[idx] : 100,
      [b.ticker]: b.sparkline ? b.sparkline[idx] : 100,
    }));

    return {
      stockA: a,
      stockB: b,
      winsA,
      winsB,
      categories,
      chartData
    };
  }, [comparedStocks]);

  return {
    selectedTickers,
    toggleStock,
    clearCompare,
    comparedStocks,
    comparisonResults,
    isCompareReady: comparedStocks.length === 2
  };
}
