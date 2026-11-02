import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputPath = path.join(rootDir, 'apps', 'poc-stock-screener', 'src', 'data', 'universe-tickers.json');

// 1. 네이버 금융 모바일 REST API로 KOSPI/KOSDAQ 상위 종목 수집
async function fetchKoreanUniverse(marketCode, targetCount) {
  const result = [];
  const pageSize = 100;
  const pagesNeeded = Math.ceil(targetCount / pageSize);

  for (let page = 1; page <= pagesNeeded; page++) {
    const url = `https://m.stock.naver.com/api/stocks/marketValue/${marketCode}?page=${page}&pageSize=${pageSize}`;
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const stocks = json?.stocks || [];

      for (const s of stocks) {
        if (!result.some(r => r.ticker === s.itemCode)) {
          result.push({
            ticker: s.itemCode,
            name: s.stockName,
            market: marketCode.toLowerCase(), // 'kospi' | 'kosdaq'
            price: Number(s.closePriceRaw) || 0,
            marketCap: s.marketValueHangeul || '',
            changeRate: Number(s.fluctuationsRatio) || 0,
          });
        }
        if (result.length >= targetCount) break;
      }
      console.log(`  ✅ [${marketCode}] Page ${page} fetched (${result.length}/${targetCount} stocks)`);
      await new Promise(r => setTimeout(r, 100));
    } catch (e) {
      console.error(`  ❌ Failed to fetch ${marketCode} page ${page}:`, e.message);
    }
  }

  return result;
}

// 2. Wikipedia API로 S&P 500 전 종목 추출
async function fetchSP500Universe() {
  console.log('📦 Fetching S&P 500 constituents from Wikipedia...');
  const url = 'https://en.wikipedia.org/w/api.php?action=parse&page=List_of_S%26P_500_companies&prop=wikitext&format=json';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'make-monorepo/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const wikitext = json?.parse?.wikitext?.['*'] || '';

    const regex = /\{\{(?:NyseSymbol|NasdaqSymbol|ticker)\|([A-Z.-]+)\}\}\s*\|\|\s*\[\[(?:[^\]|]+\|)?([^\]]+)\]\]\s*\|\|\s*([^\n|]+)/gi;
    let m;
    const result = [];
    while ((m = regex.exec(wikitext)) !== null) {
      const ticker = m[1].trim().replace(/\./g, '-');
      const name = m[2].trim();
      const sector = m[3].trim();
      if (!result.some(r => r.ticker === ticker)) {
        result.push({
          ticker,
          name,
          sector,
          market: 'sp500'
        });
      }
    }
    console.log(`  ✅ [S&P 500] Extracted ${result.length} tickers`);
    return result;
  } catch (e) {
    console.error('  ❌ Failed to fetch S&P 500:', e.message);
    return [];
  }
}

async function main() {
  console.log('🚀 [Build Universe] Scraping KOSPI 200, KOSDAQ 150, S&P 500 tickers...\n');

  // 1. KOSPI 200
  console.log('📦 Fetching KOSPI Top 200...');
  const kospi = await fetchKoreanUniverse('KOSPI', 200);

  // 2. KOSDAQ 150
  console.log('\n📦 Fetching KOSDAQ Top 150...');
  const kosdaq = await fetchKoreanUniverse('KOSDAQ', 150);

  // 3. S&P 500
  console.log('\n📦 Fetching S&P 500...');
  const sp500 = await fetchSP500Universe();

  const universe = {
    totalCount: kospi.length + kosdaq.length + sp500.length,
    kospiCount: kospi.length,
    kosdaqCount: kosdaq.length,
    sp500Count: sp500.length,
    kospi,
    kosdaq,
    sp500
  };

  fs.writeFileSync(outputPath, JSON.stringify(universe, null, 2), 'utf8');
  console.log(`\n🎉 [Universe Generated] Total ${universe.totalCount} stocks (KOSPI: ${universe.kospiCount}, KOSDAQ: ${universe.kosdaqCount}, S&P 500: ${universe.sp500Count}) saved to ${outputPath}`);
}

main().catch(console.error);
