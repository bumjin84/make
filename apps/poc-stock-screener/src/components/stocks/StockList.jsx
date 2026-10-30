import React, { useState } from 'react';
import { Search, LayoutGrid, Table as TableIcon } from 'lucide-react';
import StockCard from './StockCard';
import StockTable from './StockTable';

export default function StockList({
  stocks,
  selectedTickers,
  onToggleCompare,
  market,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  return (
    <div className="space-y-4">
      {/* 검색 및 뷰 모드 컨트롤 바 */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* 검색 인풋 */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="종목명, 티커(AAPL, 005930), 섹터 검색..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* 뷰 모드 & 정렬 셀렉터 */}
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 font-medium"
          >
            <option value="marketCap">정렬: 시가총액순</option>
            <option value="return3M">정렬: 3개월 수익률순</option>
            <option value="return1Y">정렬: 1년 수익률순</option>
            <option value="roe">정렬: ROE 높은순</option>
            <option value="dividendYield">정렬: 배당률 높은순</option>
            <option value="forwardPe">정렬: 선행 PER 낮은순</option>
          </select>

          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="카드 그리드 뷰"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="재무 테이블 뷰"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 종목 표시 영역 */}
      {stocks.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
          <p className="text-sm font-medium text-slate-400">조건에 일치하는 종목이 없습니다.</p>
          <p className="text-xs text-slate-500 mt-1">다른 전략을 선택하거나 검색어를 변경해보세요.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.map((stock) => (
            <StockCard
              key={stock.ticker}
              stock={stock}
              isCompared={selectedTickers.includes(stock.ticker)}
              onToggleCompare={onToggleCompare}
              market={market}
            />
          ))}
        </div>
      ) : (
        <StockTable
          stocks={stocks}
          selectedTickers={selectedTickers}
          onToggleCompare={onToggleCompare}
          market={market}
          sortBy={sortBy}
          onSortChange={onSortChange}
        />
      )}
    </div>
  );
}
