import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const usDataPath = path.join(rootDir, 'apps', 'poc-stock-screener', 'src', 'data', 'stocks-us.json');
const krDataPath = path.join(rootDir, 'apps', 'poc-stock-screener', 'src', 'data', 'stocks-kr.json');

// 이동평균선(Moving Average) 계산 헬퍼
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

  // 20일선 이격도: (현재가 / 20일선 - 1) * 100
  const disparity20 = Number((((currentPrice - ma20) / ma20) * 100).toFixed(1));

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
  };
}

// 🇺🇸 미국장 일별 시세 수집기 (Yahoo Finance v8 API)
async function fetchUSDailyData(ticker) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=6mo&interval=1d`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const result = json?.chart?.result?.[0];
    if (!result) throw new Error('No result');

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
  } catch (err) {
    console.warn(`  ⚠️ [US] Failed to fetch live daily data for ${ticker}: ${err.message}`);
    return null;
  }
}

// 🇰🇷 국내장 일별 시세 수집기 (네이버 금융 차트 API)
async function fetchKRDailyData(ticker) {
  try {
    const url = `https://fchart.stock.naver.com/sise.nhn?symbol=${ticker}&timeframe=day&count=120&requestType=0`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();

    const regex = /<item data="([^"]+)"/g;
    let match;
    const dates = [];
    const closes = [];
    const volumes = [];

    while ((match = regex.exec(text)) !== null) {
      const parts = match[1].split('|'); // 날짜|시가|고가|저가|종가|거래량
      if (parts.length >= 6) {
        const rawDate = parts[0]; // YYYYMMDD
        const formattedDate = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
        const close = Number(parts[4]);
        const volume = Number(parts[5]);

        dates.push(formattedDate);
        closes.push(close);
        volumes.push(volume);
      }
    }

    return { dates, closes, volumes };
  } catch (err) {
    console.warn(`  ⚠️ [KR] Failed to fetch live daily data for ${ticker}: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 [Daily Stock Data Pipeline] Starting data enrichment for trend analysis...\n');

  // 1. 미국장 주식 데이터 업데이트
  if (fs.existsSync(usDataPath)) {
    const usStocks = JSON.parse(fs.readFileSync(usDataPath, 'utf8'));
    console.log(`📦 [US Market] Enriching ${usStocks.length} stocks with daily history & MA alignment...`);

    for (let i = 0; i < usStocks.length; i++) {
      const stock = usStocks[i];
      process.stdout.write(`  [${i + 1}/${usStocks.length}] ${stock.ticker} (${stock.name})... `);
      const daily = await fetchUSDailyData(stock.ticker);

      if (daily && daily.closes.length > 0) {
        // 최근 60영업일로 컴팩트하게 슬라이싱
        const sliceCount = Math.min(daily.closes.length, 60);
        stock.daily = {
          dates: daily.dates.slice(-sliceCount),
          closes: daily.closes.slice(-sliceCount),
          volumes: daily.volumes.slice(-sliceCount),
        };

        // 최신 종가 및 기술적 추세/정배열 지표 계산
        const trend = analyzeTrend(daily);
        stock.price = trend.currentPrice;
        stock.trendAnalysis = trend;
        console.log(`✅ ${trend.trendStatus} (P:${trend.currentPrice}, MA20:${trend.ma20}, MA60:${trend.ma60})`);
      } else {
        console.log('⏩ Kept fallback');
      }

      // API Rate Limit 배려 (150ms 딜레이)
      await new Promise(r => setTimeout(r, 150));
    }

    fs.writeFileSync(usDataPath, JSON.stringify(usStocks, null, 2), 'utf8');
    console.log(`✨ Successfully updated [US Market] data at ${usDataPath}\n`);
  }

  // 2. 국내장 주식 데이터 업데이트
  if (fs.existsSync(krDataPath)) {
    const krStocks = JSON.parse(fs.readFileSync(krDataPath, 'utf8'));
    console.log(`📦 [KR Market] Enriching ${krStocks.length} stocks with daily history & MA alignment...`);

    for (let i = 0; i < krStocks.length; i++) {
      const stock = krStocks[i];
      process.stdout.write(`  [${i + 1}/${krStocks.length}] ${stock.ticker} (${stock.name})... `);
      const daily = await fetchKRDailyData(stock.ticker);

      if (daily && daily.closes.length > 0) {
        const sliceCount = Math.min(daily.closes.length, 60);
        stock.daily = {
          dates: daily.dates.slice(-sliceCount),
          closes: daily.closes.slice(-sliceCount),
          volumes: daily.volumes.slice(-sliceCount),
        };

        const trend = analyzeTrend(daily);
        stock.price = trend.currentPrice;
        stock.trendAnalysis = trend;
        console.log(`✅ ${trend.trendStatus} (P:${trend.currentPrice}, MA20:${trend.ma20}, MA60:${trend.ma60})`);
      } else {
        console.log('⏩ Kept fallback');
      }

      await new Promise(r => setTimeout(r, 100));
    }

    fs.writeFileSync(krDataPath, JSON.stringify(krStocks, null, 2), 'utf8');
    console.log(`✨ Successfully updated [KR Market] data at ${krDataPath}\n`);
  }

  console.log('🎉 [Pipeline Complete] All stocks now contain 60-day daily series and moving average alignment data!');
}

main().catch(err => {
  console.error('Pipeline error:', err);
  process.exit(1);
});
