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
      },
      {
        name: '이평선 추세 (정배열 판정)',
        valA: a.trendAnalysis?.trendStatus ? a.trendAnalysis.trendStatus.split(' ')[0] : '데이터 없음',
        valB: b.trendAnalysis?.trendStatus ? b.trendAnalysis.trendStatus.split(' ')[0] : '데이터 없음',
        winner: a.trendAnalysis?.isBullishAlignment && !b.trendAnalysis?.isBullishAlignment
          ? a.ticker
          : b.trendAnalysis?.isBullishAlignment && !a.trendAnalysis?.isBullishAlignment
          ? b.ticker
          : a.trendAnalysis?.isShortTermBullish && !b.trendAnalysis?.isShortTermBullish
          ? a.ticker
          : b.trendAnalysis?.isShortTermBullish && !a.trendAnalysis?.isShortTermBullish
          ? b.ticker
          : 'draw',
        desc: '일별 20일선 > 60일선 > 120일선 정배열 추세 우위'
      }
    ];

    const winsA = categories.filter(c => c.winner === a.ticker).length;
    const winsB = categories.filter(c => c.winner === b.ticker).length;

    // 실제 60일 일별 데이터 기반 기준 100 정규화 시계열 생성
    let chartData = [];
    if (a.daily?.closes && b.daily?.closes && a.daily.closes.length > 0 && b.daily.closes.length > 0) {
      const len = Math.min(a.daily.closes.length, b.daily.closes.length);
      const dates = a.daily.dates.slice(-len);
      const closesA = a.daily.closes.slice(-len);
      const closesB = b.daily.closes.slice(-len);
      const baseA = closesA[0] || 1;
      const baseB = closesB[0] || 1;

      // 60일 전체 또는 보기 좋게 10~15개 샘플링 지점 생성
      const step = Math.max(1, Math.floor(len / 20));
      for (let i = 0; i < len; i += step) {
        chartData.push({
          date: dates[i] ? dates[i].slice(5) : `${i}일`, // MM-DD
          [a.ticker]: Number(((closesA[i] / baseA) * 100).toFixed(1)),
          [b.ticker]: Number(((closesB[i] / baseB) * 100).toFixed(1)),
        });
      }
      // 마지막 날짜(현재) 포함
      if (chartData[chartData.length - 1].date !== dates[len - 1].slice(5)) {
        chartData.push({
          date: dates[len - 1].slice(5),
          [a.ticker]: Number(((closesA[len - 1] / baseA) * 100).toFixed(1)),
          [b.ticker]: Number(((closesB[len - 1] / baseB) * 100).toFixed(1)),
        });
      }
    } else {
      const labels = ['3M 전', '2.5M 전', '2M 전', '1.5M 전', '1M 전', '현재'];
      chartData = labels.map((label, idx) => ({
        date: label,
        [a.ticker]: a.sparkline ? a.sparkline[idx] : 100,
        [b.ticker]: b.sparkline ? b.sparkline[idx] : 100,
      }));
    }

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

