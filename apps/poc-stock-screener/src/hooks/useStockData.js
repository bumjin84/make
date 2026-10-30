import { useMemo } from 'react';
import usStocks from '../data/stocks-us.json';
import krStocks from '../data/stocks-kr.json';
import { getMatchingStrategies } from '../utils/strategies';

export function useStockData(market = 'us') {
  return useMemo(() => {
    const rawData = market === 'us' ? usStocks : krStocks;
    return rawData.map(stock => ({
      ...stock,
      market,
      matchedStrategies: getMatchingStrategies(stock)
    }));
  }, [market]);
}

