import React, { useState } from 'react';
import Header from './components/layout/Header';
import MarketSelector from './components/layout/MarketSelector';
import StrategyBar from './components/strategy/StrategyBar';
import StockList from './components/stocks/StockList';
import CompareDrawer from './components/compare/CompareDrawer';
import { useStockData } from './hooks/useStockData';
import { useStockFilter } from './hooks/useStockFilter';
import { useStockCompare } from './hooks/useStockCompare';

export default function App() {
  const [market, setMarket] = useState('us'); // 'us' | 'kr'
  const stocks = useStockData(market);

  const {
    selectedStrategy,
    setSelectedStrategy,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredStocks,
    filteredCount
  } = useStockFilter(stocks);

  const {
    selectedTickers,
    toggleStock,
    clearCompare,
    comparedStocks,
    comparisonResults
  } = useStockCompare(stocks);

  const handleMarketChange = (nextMarket) => {
    setMarket(nextMarket);
    clearCompare();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-32">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 시장 전환기 */}
        <div className="flex justify-center sm:justify-start">
          <MarketSelector market={market} onChange={handleMarketChange} />
        </div>

        {/* 4대 추천 전략 탭 및 설명 */}
        <StrategyBar
          selectedStrategy={selectedStrategy}
          onSelectStrategy={setSelectedStrategy}
          filteredCount={filteredCount}
        />

        {/* 종목 리스트 (그리드 카드 & 테이블 뷰) */}
        <StockList
          stocks={filteredStocks}
          selectedTickers={selectedTickers}
          onToggleCompare={toggleStock}
          market={market}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </main>

      {/* 1:1 맞대결 비교 플로팅 드로어 */}
      <CompareDrawer
        comparedStocks={comparedStocks}
        comparisonResults={comparisonResults}
        onClear={clearCompare}
        onRemoveTicker={toggleStock}
      />
    </div>
  );
}
