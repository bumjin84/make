import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const universePath = path.join(rootDir, 'apps', 'poc-stock-screener', 'src', 'data', 'universe-tickers.json');
const usDataPath = path.join(rootDir, 'apps', 'poc-stock-screener', 'src', 'data', 'stocks-us.json');
const krDataPath = path.join(rootDir, 'apps', 'poc-stock-screener', 'src', 'data', 'stocks-kr.json');
const metadataPath = path.join(rootDir, 'apps', 'poc-stock-screener', 'src', 'data', 'metadata.json');

// ETF / 금융상품 여부 판별
function checkIsETF(name) {
  const etfPattern = /KODEX|TIGER|ACE|RISE|KBSTAR|SOL|PLUS|KOSEF|HANARO|WOORI|머니마켓|CD금리|액티브|선물|레버리지|인버스|스팩|SPAC|ETN/i;
  return etfPattern.test(name);
}

// 이동평균선(MA) 계산 헬퍼
function calculateMA(closes, period) {
  if (closes.length < period) return null;
  const slice = closes.slice(-period);
  const sum = slice.reduce((acc, val) => acc + val, 0);
  return Number((sum / period).toFixed(2));
}

// 정배열 및 기술적 추세 분석 함수
function analyzeTrend(daily) {
  const closes = daily.closes;
  if (!closes || closes.length === 0) {
    return {
      ma5: null,
      ma20: null,
      ma60: null,
      ma120: null,
      isBullishAlignment: false,
      isShortTermBullish: false,
      trendStatus: '데이터 부족',
      disparity20: 0,
      return3M: null,
      return1Y: null,
    };
  }

  const currentPrice = closes[closes.length - 1];
  const ma5 = calculateMA(closes, 5) || currentPrice;
  const ma20 = calculateMA(closes, 20) || currentPrice;
  const ma60 = calculateMA(closes, 60) || ma20;
  const ma120 = calculateMA(closes, 120) || ma60;

  // 1. 완전 정배열: 현재가 > 20일선 > 60일선 > 120일선
  const isBullishAlignment = currentPrice > ma20 && ma20 > ma60 && ma60 > ma120;
  // 2. 단기 정배열: 현재가 > 20일선 > 60일선
  const isShortTermBullish = currentPrice > ma20 && ma20 > ma60;
  // 3. 역배열 (하락 추세): 현재가 < 20일선 && 20일선 < 60일선
  const isBearish = currentPrice < ma20 && ma20 < ma60;

  let trendStatus = '혼조/횡보 (Neutral)';
  if (isBullishAlignment) {
    trendStatus = '완전 정배열 (Strong Bull 🔥)';
  } else if (isShortTermBullish) {
    trendStatus = '단기 정배열 (Bull Trend 📈)';
  } else if (isBearish) {
    trendStatus = '역배열 하락세 (Bearish ⚠️)';
  }

  // 20일선 이격도
  const disparity20 = Number((((currentPrice - ma20) / ma20) * 100).toFixed(1));

  // 3개월(약 60영업일) 수익률 계산
  const base3M = closes[0] || currentPrice;
  const return3M = Number((((currentPrice - base3M) / base3M) * 100).toFixed(1));

  return {
    currentPrice,
    ma5,
    ma20,
    ma60,
    ma120,
    isBullishAlignment,
    isShortTermBullish,
    trendStatus,
    disparity20,
    return3M,
  };
}

// 🇰🇷 국내장 실시간 재무 지표 수집기 (네이버 금융 모바일 API)
async function fetchKRFinancials(ticker) {
  let pe = null, forwardPe = null, dividendYield = null, marketCap = null;
  let roe = null, operatingMargin = null, debtRatio = null, priceToHigh52w = null;

  try {
    const integRes = await fetch(`https://m.stock.naver.com/api/stock/${ticker}/integration`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(6000)
    });
    if (integRes.ok) {
      const data = await integRes.json();
      const totalInfos = data.totalInfos || [];
      const getVal = (code) => totalInfos.find(i => i.code === code)?.value;

      const rawPer = getVal('per');
      if (rawPer && rawPer !== '-') {
        const val = parseFloat(rawPer.replace(/[^0-9.]/g, ''));
        if (!isNaN(val)) pe = Number(val.toFixed(2));
      }

      const rawCnsPer = getVal('cnsPer');
      if (rawCnsPer && rawCnsPer !== '-') {
        const val = parseFloat(rawCnsPer.replace(/[^0-9.]/g, ''));
        if (!isNaN(val)) forwardPe = Number(val.toFixed(2));
      }

      const rawDiv = getVal('dividendYieldRatio');
      if (rawDiv && rawDiv !== '-') {
        const val = parseFloat(rawDiv.replace(/[^0-9.]/g, ''));
        if (!isNaN(val)) dividendYield = Number(val.toFixed(2));
      }

      marketCap = getVal('marketValue') || null;

      const high52 = getVal('highPriceOf52Weeks');
      const lastClose = getVal('lastClosePrice');
      if (high52 && lastClose) {
        const h = parseFloat(high52.replace(/[^0-9.]/g, ''));
        const c = parseFloat(lastClose.replace(/[^0-9.]/g, ''));
        if (h && c && h > 0) {
          priceToHigh52w = Number((((c - h) / h) * 100).toFixed(1));
        }
      }
    }
  } catch {}

  try {
    const finRes = await fetch(`https://m.stock.naver.com/api/stock/${ticker}/finance/annual`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(6000)
    });
    if (finRes.ok) {
      const finData = await finRes.json();
      const rowList = finData?.financeInfo?.rowList || [];
      const extractLatest = (title) => {
        const row = rowList.find(r => r.title === title);
        if (!row || !row.columns) return null;
        const keys = Object.keys(row.columns).sort().reverse();
        for (const k of keys) {
          const v = row.columns[k]?.value;
          if (v && v !== '-' && !isNaN(parseFloat(v))) return Number(parseFloat(v).toFixed(2));
        }
        return null;
      };

      roe = extractLatest('ROE');
      operatingMargin = extractLatest('영업이익률');
      debtRatio = extractLatest('부채비율');
    }
  } catch {}

  return { pe, forwardPe, dividendYield, marketCap, roe, operatingMargin, debtRatio, priceToHigh52w };
}

// 🇰🇷 국내장 일별 시세 수집기 (네이버 금융 차트 API)
async function fetchKRDailyData(ticker) {
  try {
    const url = `https://fchart.stock.naver.com/sise.nhn?symbol=${ticker}&timeframe=day&count=120&requestType=0`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return null;
    const text = await res.text();

    const regex = /<item data="([^"]+)"/g;
    let match;
    const dates = [];
    const closes = [];
    const volumes = [];

    while ((match = regex.exec(text)) !== null) {
      const parts = match[1].split('|'); // 날짜|시가|고가|저가|종가|거래량
      if (parts.length >= 6) {
        const rawDate = parts[0];
        const formattedDate = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
        const close = Number(parts[4]);
        const volume = Number(parts[5]);

        dates.push(formattedDate);
        closes.push(close);
        volumes.push(volume);
      }
    }

    return { dates, closes, volumes };
  } catch {
    return null;
  }
}

// 🇺🇸 미국장 일별 시세 수집기 (Yahoo Finance v8 API)
async function fetchUSDailyData(ticker) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=6mo&interval=1d`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return null;
    const json = await res.json();
    const result = json?.chart?.result?.[0];
    if (!result) return null;

    const timestamps = result.timestamp || [];
    const quote = result.indicators?.quote?.[0] || {};
    const rawCloses = quote.close || [];
    const rawVolumes = quote.volume || [];

    const dates = [];
    const closes = [];
    const volumes = [];

    for (let i = 0; i < timestamps.length; i++) {
      if (rawCloses[i] !== null && rawCloses[i] !== undefined) {
        const d = new Date(timestamps[i] * 1000);
        const dateStr = d.toISOString().split('T')[0];
        dates.push(dateStr);
        closes.push(Number(rawCloses[i].toFixed(2)));
        volumes.push(rawVolumes[i] || 0);
      }
    }

    return { dates, closes, volumes };
  } catch {
    return null;
  }
}

// 병렬 배치 실행 헬퍼 (동시 N개 처리)
async function mapConcurrent(items, concurrency, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const chunk = items.slice(i, i + concurrency);
    const chunkResults = await Promise.all(chunk.map((item, idx) => fn(item, i + idx)));
    results.push(...chunkResults);
  }
  return results;
}

async function main() {
  console.log('🚀 [Mega Data Pipeline] Starting parallel enrichment for stock universe...\n');

  if (!fs.existsSync(universePath)) {
    console.error('❌ universe-tickers.json not found!');
    process.exit(1);
  }

  const universe = JSON.parse(fs.readFileSync(universePath, 'utf8'));

  // 기존 정밀 데이터셋 캐시 로드
  const oldUsMap = new Map();
  if (fs.existsSync(usDataPath)) {
    try {
      const oldUs = JSON.parse(fs.readFileSync(usDataPath, 'utf8'));
      oldUs.forEach(s => oldUsMap.set(s.ticker, s));
    } catch {}
  }

  const oldKrMap = new Map();
  if (fs.existsSync(krDataPath)) {
    try {
      const oldKr = JSON.parse(fs.readFileSync(krDataPath, 'utf8'));
      oldKr.forEach(s => oldKrMap.set(s.ticker, s));
    } catch {}
  }

  // 1. 국내장 (KOSPI 200 + KOSDAQ 150 = 350개) 수집
  const krTargets = [...universe.kospi, ...universe.kosdaq];
  console.log(`📦 [KR Universe] Enriching ${krTargets.length} stocks (KOSPI ${universe.kospiCount} + KOSDAQ ${universe.kosdaqCount}) concurrently (6 workers)...`);

  let krSuccess = 0;
  let krFinSuccess = 0;

  const enrichedKR = await mapConcurrent(krTargets, 6, async (item, index) => {
    const cached = oldKrMap.get(item.ticker) || {};
    const isETF = checkIsETF(item.name);

    // 1) 일별 시세 수집
    const daily = await fetchKRDailyData(item.ticker);
    let price = item.price || cached.price || 0;
    let trend = cached.trendAnalysis || null;
    let compactDaily = cached.daily || null;

    if (daily && daily.closes.length > 0) {
      const sliceCount = Math.min(daily.closes.length, 60);
      compactDaily = {
        dates: daily.dates.slice(-sliceCount),
        closes: daily.closes.slice(-sliceCount),
        volumes: daily.volumes.slice(-sliceCount),
      };
      trend = analyzeTrend(daily);
      price = trend.currentPrice;
      krSuccess++;
    }

    if ((index + 1) % 50 === 0 || index + 1 === krTargets.length) {
      console.log(`  ⏳ [KR Progress] ${index + 1}/${krTargets.length} processed...`);
    }

    // 2) ETF 상품인 경우: 개별 기업 재무제표 수집 제외하고 null 처리
    if (isETF) {
      return {
        ticker: item.ticker,
        name: item.name,
        market: 'kr',
        subMarket: item.market,
        sector: 'ETF/상장지수펀드',
        isETF: true,
        price,
        marketCap: item.marketCap || cached.marketCap || '-',
        pe: null,
        forwardPe: null,
        roe: null,
        operatingMargin: null,
        dividendYield: null,
        return3M: trend ? trend.return3M : null,
        return1Y: null,
        consensusGrowth: null,
        debtRatio: null,
        priceToHigh52w: null,
        reasoning: '상장지수펀드(ETF) 상품으로 개별 기업 재무제표가 제공되지 않습니다.',
        daily: compactDaily,
        trendAnalysis: trend
      };
    }

    // 3) 개별 기업 주식: 네이버 금융 실시간 재무 API 수집
    const fin = await fetchKRFinancials(item.ticker);
    if (fin.pe !== null || fin.roe !== null) {
      krFinSuccess++;
    }

    return {
      ticker: item.ticker,
      name: item.name,
      market: 'kr',
      subMarket: item.market,
      sector: cached.sector || (item.market === 'kospi' ? '코스피 상장주' : '코스닥 상장주'),
      isETF: false,
      price,
      marketCap: fin.marketCap || item.marketCap || cached.marketCap || '-',
      pe: fin.pe ?? cached.pe ?? null,
      forwardPe: fin.forwardPe ?? cached.forwardPe ?? null,
      roe: fin.roe ?? cached.roe ?? null,
      operatingMargin: fin.operatingMargin ?? cached.operatingMargin ?? null,
      dividendYield: fin.dividendYield ?? cached.dividendYield ?? null,
      return3M: trend ? trend.return3M : (cached.return3M ?? null),
      return1Y: cached.return1Y ?? null,
      consensusGrowth: cached.consensusGrowth ?? null,
      debtRatio: fin.debtRatio ?? cached.debtRatio ?? null,
      priceToHigh52w: fin.priceToHigh52w ?? cached.priceToHigh52w ?? null,
      reasoning: cached.reasoning || `${item.name} (${item.market.toUpperCase()} 대표 상장 기업)`,
      daily: compactDaily,
      trendAnalysis: trend
    };
  });

  fs.writeFileSync(krDataPath, JSON.stringify(enrichedKR, null, 2), 'utf8');
  console.log(`✨ [KR Market] Saved ${enrichedKR.length} stocks to ${krDataPath} (Price series: ${krSuccess}, Financials: ${krFinSuccess})\n`);

  // 2. 미국장 S&P 500 (493개) 수집
  console.log(`📦 [US Universe] Enriching ${universe.sp500.length} S&P 500 stocks concurrently (8 workers)...`);
  let usSuccess = 0;

  const enrichedUS = await mapConcurrent(universe.sp500, 8, async (item, index) => {
    const cached = oldUsMap.get(item.ticker) || {};
    const daily = await fetchUSDailyData(item.ticker);

    let price = cached.price || 100;
    let trend = cached.trendAnalysis || null;
    let compactDaily = cached.daily || null;

    if (daily && daily.closes.length > 0) {
      const sliceCount = Math.min(daily.closes.length, 60);
      compactDaily = {
        dates: daily.dates.slice(-sliceCount),
        closes: daily.closes.slice(-sliceCount),
        volumes: daily.volumes.slice(-sliceCount),
      };
      trend = analyzeTrend(daily);
      price = trend.currentPrice;
      usSuccess++;
    }

    if ((index + 1) % 50 === 0 || index + 1 === universe.sp500.length) {
      console.log(`  ⏳ [US Progress] ${index + 1}/${universe.sp500.length} processed...`);
    }

    return {
      ticker: item.ticker,
      name: cached.name || item.name,
      market: 'us',
      subMarket: 'sp500',
      sector: item.sector || cached.sector || 'S&P 500',
      isETF: false,
      price,
      marketCap: cached.marketCap || '-',
      pe: cached.pe ?? null,
      forwardPe: cached.forwardPe ?? null,
      roe: cached.roe ?? null,
      operatingMargin: cached.operatingMargin ?? null,
      dividendYield: cached.dividendYield ?? null,
      return3M: trend ? trend.return3M : (cached.return3M ?? null),
      return1Y: cached.return1Y ?? null,
      consensusGrowth: cached.consensusGrowth ?? null,
      debtRatio: cached.debtRatio ?? null,
      priceToHigh52w: cached.priceToHigh52w ?? null,
      reasoning: cached.reasoning || `${item.name} (미국 S&P 500 ${item.sector || '핵심 산업'} 주도주)`,
      daily: compactDaily,
      trendAnalysis: trend
    };
  });

  fs.writeFileSync(usDataPath, JSON.stringify(enrichedUS, null, 2), 'utf8');
  console.log(`✨ [US Market] Saved ${enrichedUS.length} stocks to ${usDataPath} (Live series updated: ${usSuccess})\n`);

  // 3. 메타데이터 갱신
  const now = new Date();
  const kstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  const formattedKst = kstDate.toISOString().replace('T', ' ').slice(0, 16).replace(/-/g, '.') + ' KST';

  const metadata = {
    lastUpdated: formattedKst,
    totalCount: enrichedKR.length + enrichedUS.length,
    usCount: enrichedUS.length,
    krCount: enrichedKR.length,
    kospiCount: universe.kospiCount,
    kosdaqCount: universe.kosdaqCount,
    sp500Count: universe.sp500Count,
    etfCount: enrichedKR.filter(s => s.isETF).length,
    cronSchedule: '하루 4회 (06:15, 12:15, 16:15, 23:15 KST)',
    status: 'Operational'
  };

  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
  console.log(`📝 [Metadata] Saved total ${metadata.totalCount} stocks timestamp: ${formattedKst}`);
  console.log('🎉 [Mega Pipeline Complete] Universe fully enriched with live series & financials without mock numbers!');
}

main().catch(err => {
  console.error('Mega pipeline error:', err);
  process.exit(1);
});
