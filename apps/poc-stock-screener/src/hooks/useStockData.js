import { useMemo } from 'react';
import usStocks from '../data/stocks-us.json';
import krStocks from '../data/stocks-kr.json';
import { getMatchingStrategies } from '../utils/strategies';

export function useStockData(market = 'sp500') {
  return useMemo(() => {
    let rawData = [];
    let isUS = false;

    if (market === 'sp500') {
      rawData = usStocks;
      isUS = true;
    } else if (market === 'kospi') {
      rawData = krStocks.filter(s => s.subMarket === 'kospi');
    } else if (market === 'kosdaq') {
      rawData = krStocks.filter(s => s.subMarket === 'kosdaq');
    } else {
      rawData = usStocks;
      isUS = true;
    }

    return rawData.map(stock => ({
      ...stock,
      market: isUS ? 'us' : 'kr',
      matchedStrategies: getMatchingStrategies(stock)
    }));
  }, [market]);
}
