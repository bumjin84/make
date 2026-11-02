import React, { useState } from 'react';
import Header from './components/layout/Header';
import MarketSelector from './components/layout/MarketSelector';
import StrategyBar from './components/strategy/StrategyBar';
import StockList from './components/stocks/StockList';
import ComparePill from './components/compare/ComparePill';
import CompareModal from './components/compare/CompareModal';
import { useStockData } from './hooks/useStockData';
import { useStockFilter } from './hooks/useStockFilter';
import { useStockCompare } from './hooks/useStockCompare';
import metadata from './data/metadata.json';

export default function App() {
  const [market, setMarket] = useState('sp500'); // 'sp500' | 'kospi' | 'kosdaq'
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
    comparisonResults,
    isModalOpen,
    openModal,
    closeModal
  } = useStockCompare(stocks);

  const handleMarketChange = (nextMarket) => {
    setMarket(nextMarket);
    clearCompare();
  };

  const marketCounts = {
    sp500: metadata.sp500Count || 493,
    kospi: metadata.kospiCount || 200,
    kosdaq: metadata.kosdaqCount || 150,
    etf: metadata.etfCount || 42
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-32">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 3대 시장 전환기 (S&P 500 / 코스피 200 / 코스닥 150) */}
        <div className="flex justify-center sm:justify-start">
          <MarketSelector
            market={market}
            onChange={handleMarketChange}
            counts={marketCounts}
          />
        </div>

        {/* 4대 추천 전략 탭 및 설명 */}
        <StrategyBar
          selectedStrategy={selectedStrategy}
          onSelectStrategy={setSelectedStrategy}
          filteredCount={filteredCount}
        />

        {/* 종목 리스트 (24개 단위 페이징 & 반응형 카드/테이블 뷰) */}
        <StockList
          stocks={filteredStocks}
          selectedTickers={selectedTickers}
          onToggleCompare={toggleStock}
          market={market === 'sp500' ? 'us' : 'kr'}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </main>

      {/* 하단 플로팅 맞대결 런처 칩 */}
      <ComparePill
        comparedStocks={comparedStocks}
        onOpenModal={openModal}
        onClear={clearCompare}
      />

      {/* 1:1 맞대결 반응형 모달 (PC: 중앙 팝업, 모바일: 풀스크린) */}
      <CompareModal
        isOpen={isModalOpen}
        comparisonResults={comparisonResults}
        onClose={closeModal}
        onClear={clearCompare}
      />
    </div>
  );
}
