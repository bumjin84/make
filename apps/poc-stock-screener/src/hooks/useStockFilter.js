import { useState, useMemo } from 'react';
import { STRATEGIES } from '../utils/strategies';

export function useStockFilter(stocks) {
  const [selectedStrategy, setSelectedStrategy] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('marketCap'); // marketCap, return3M, roe, dividendYield, forwardPe

  const filteredStocks = useMemo(() => {
    return stocks
      .filter(stock => {
        // 1. 전략 필터링
        if (selectedStrategy !== 'all') {
          const strategyDef = STRATEGIES[selectedStrategy];
          if (strategyDef && !strategyDef.filter(stock)) {
            return false;
          }
        }

        // 2. 검색어 필터링 (티커, 종목명, 섹터)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTicker = stock.ticker.toLowerCase().includes(q);
          const matchName = stock.name.toLowerCase().includes(q);
          const matchSector = stock.sector.toLowerCase().includes(q);
          if (!matchTicker && !matchName && !matchSector) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'return3M') return b.return3M - a.return3M;
        if (sortBy === 'return1Y') return b.return1Y - a.return1Y;
        if (sortBy === 'roe') return b.roe - a.roe;
        if (sortBy === 'dividendYield') return b.dividendYield - a.dividendYield;
        if (sortBy === 'forwardPe') return a.forwardPe - b.forwardPe; // 낮은 PER 순
        // 기본은 원본 순서 유지 (시가총액 순서)
        return 0;
      });
  }, [stocks, selectedStrategy, searchQuery, sortBy]);

  return {
    selectedStrategy,
    setSelectedStrategy,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredStocks,
    totalCount: stocks.length,
    filteredCount: filteredStocks.length
  };
}

