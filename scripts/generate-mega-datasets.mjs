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

// 이동평균선(MA) 계산 헬퍼
function calculateMA(closes, period) {
  if (closes.length < period) return null;
  const slice = closes.slice(-period);
  const sum = slice.reduce((acc, val) => acc + val, 0);
  return Number((sum / period).toFixed(2));
}

// 60영업일 날짜 배열 생성
function generate60Dates() {
  const dates = [];
  const base = new Date('2026-11-02');
  let current = new Date(base);
  while (dates.length < 60) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) { // 주말 제외
      dates.unshift(current.toISOString().split('T')[0]);
    }
    current.setDate(current.getDate() - 1);
  }
  return dates;
}

// 60일 종가 및 추세 생성
function generateDailySeriesAndTrend(basePrice, trendType) {
  const dates = generate60Dates();
  const closes = [];
  const volumes = [];
  
  // trendType: 'bull' (정배열 우상향), 'bear' (역배열 우하향), 'neutral' (횡보)
  let drift = 0;
  if (trendType === 'bull') drift = 0.0035; // 하루 평균 +0.35% 상승
  else if (trendType === 'bear') drift = -0.003; // 하루 평균 -0.3% 하락
  else drift = 0.0005; // 횡보

  // 역산: 60일 전 가격부터 현재 가격까지 도달
  const totalFactor = Math.pow(1 + drift, 60);
  let price = basePrice / totalFactor;

  for (let i = 0; i < 60; i++) {
    const noise = (Math.random() - 0.48) * 0.02; // ±1% 노이즈
    price = price * (1 + drift + noise);
    closes.push(Number(price.toFixed(basePrice < 500 ? 2 : 0)));
    volumes.push(Math.floor(Math.random() * 5000000 + 500000));
  }
  // 마지막 날 가격은 basePrice로 고정
  closes[closes.length - 1] = basePrice;

  const currentPrice = basePrice;
  const ma5 = calculateMA(closes, 5) || currentPrice;
  const ma20 = calculateMA(closes, 20) || currentPrice;
  const ma60 = calculateMA(closes, 60) || ma20;
  const ma120 = Number((ma60 * (trendType === 'bull' ? 0.95 : trendType === 'bear' ? 1.05 : 1.0)).toFixed(2));

  const isBullishAlignment = currentPrice > ma20 && ma20 > ma60 && ma60 > ma120;
  const isShortTermBullish = currentPrice > ma20 && ma20 > ma60;
  const isBearish = currentPrice < ma20 && ma20 < ma60;

  let trendStatus = '혼조/횡보 (Neutral)';
  if (isBullishAlignment) {
    trendStatus = '완전 정배열 (Strong Bull 🔥)';
  } else if (isShortTermBullish) {
    trendStatus = '단기 정배열 (Bull Trend 📈)';
  } else if (isBearish) {
    trendStatus = '역배열 하락세 (Bearish ⚠️)';
  }

  const disparity20 = Number((((currentPrice - ma20) / ma20) * 100).toFixed(1));
  const base3M = closes[0];
  const return3M = Number((((currentPrice - base3M) / base3M) * 100).toFixed(1));

  return {
    daily: { dates, closes, volumes },
    trendAnalysis: {
      currentPrice,
      ma5,
      ma20,
      ma60,
      ma120,
      isBullishAlignment,
      isShortTermBullish,
      trendStatus,
      disparity20,
      return3M
    }
  };
}

// 기존 30개 정밀 데이터셋 캐시 로드
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

const universe = JSON.parse(fs.readFileSync(universePath, 'utf8'));

// 1. 국내장 350개 생성 (KOSPI 200 + KOSDAQ 150)
const enrichedKR = [...universe.kospi, ...universe.kosdaq].map((item, idx) => {
  const cached = oldKrMap.get(item.ticker);
  if (cached && cached.daily && cached.daily.closes.length > 0) {
    return {
      ...cached,
      subMarket: item.market // 'kospi' | 'kosdaq'
    };
  }

  const basePrice = item.price || 50000;
  // 상위 30%는 bull, 40%는 neutral, 30%는 bear
  const trendType = (idx % 10 < 3) ? 'bull' : (idx % 10 < 7) ? 'neutral' : 'bear';
  const { daily, trendAnalysis } = generateDailySeriesAndTrend(basePrice, trendType);

  const pe = Number((Math.random() * 22 + 6).toFixed(1));
  const forwardPe = Number((pe * (Math.random() * 0.4 + 0.7)).toFixed(1));
  const roe = Number((Math.random() * 25 + 4).toFixed(1));
  const operatingMargin = Number((Math.random() * 18 + 3).toFixed(1));
  const dividendYield = Number((Math.random() * 5.2).toFixed(2));
  const return1Y = Number((trendAnalysis.return3M * 2.2 + (Math.random() * 10 - 5)).toFixed(1));
  const consensusGrowth = Number((Math.random() * 35 + 5).toFixed(1));
  const debtRatio = Number((Math.random() * 90 + 20).toFixed(1));

  return {
    ticker: item.ticker,
    name: item.name,
    market: 'kr',
    subMarket: item.market, // 'kospi' | 'kosdaq'
    sector: item.market === 'kospi' ? '코스피 우량주' : '코스닥 혁신성장',
    price: basePrice,
    marketCap: item.marketCap || `${Math.floor(Math.random() * 50 + 1)}조원`,
    pe,
    forwardPe,
    roe,
    operatingMargin,
    dividendYield,
    return3M: trendAnalysis.return3M,
    return1Y,
    consensusGrowth,
    debtRatio,
    priceToHigh52w: Number((-Math.random() * 18).toFixed(1)),
    reasoning: `${item.name} (${item.market.toUpperCase()} 시가총액 상위 종목으로 시장 지배력 보유)`,
    daily,
    trendAnalysis
  };
});

// 2. 미국장 493개 생성 (S&P 500)
const enrichedUS = universe.sp500.map((item, idx) => {
  const cached = oldUsMap.get(item.ticker);
  if (cached && cached.daily && cached.daily.closes.length > 0) {
    return {
      ...cached,
      subMarket: 'sp500'
    };
  }

  const basePrice = Number((Math.random() * 250 + 40).toFixed(2));
  const trendType = (idx % 10 < 4) ? 'bull' : (idx % 10 < 8) ? 'neutral' : 'bear';
  const { daily, trendAnalysis } = generateDailySeriesAndTrend(basePrice, trendType);

  const pe = Number((Math.random() * 30 + 12).toFixed(1));
  const forwardPe = Number((pe * (Math.random() * 0.35 + 0.75)).toFixed(1));
  const roe = Number((Math.random() * 35 + 8).toFixed(1));
  const operatingMargin = Number((Math.random() * 25 + 8).toFixed(1));
  const dividendYield = Number((Math.random() * 3.8).toFixed(2));
  const return1Y = Number((trendAnalysis.return3M * 2.5 + (Math.random() * 15)).toFixed(1));
  const consensusGrowth = Number((Math.random() * 30 + 6).toFixed(1));
  const debtRatio = Number((Math.random() * 95 + 15).toFixed(1));

  return {
    ticker: item.ticker,
    name: item.name,
    market: 'us',
    subMarket: 'sp500',
    sector: item.sector || 'S&P 500',
    price: basePrice,
    marketCap: `${Math.floor(Math.random() * 500 + 20)}0억$`,
    pe,
    forwardPe,
    roe,
    operatingMargin,
    dividendYield,
    return3M: trendAnalysis.return3M,
    return1Y,
    consensusGrowth,
    debtRatio,
    priceToHigh52w: Number((-Math.random() * 12).toFixed(1)),
    reasoning: `${item.name} (미국 S&P 500 ${item.sector || '주요'} 섹터 핵심 종목)`,
    daily,
    trendAnalysis
  };
});

// 3. 파일 저장
fs.writeFileSync(krDataPath, JSON.stringify(enrichedKR, null, 2), 'utf8');
fs.writeFileSync(usDataPath, JSON.stringify(enrichedUS, null, 2), 'utf8');

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
  cronSchedule: '하루 4회 (06:15, 12:15, 16:15, 23:15 KST)',
  status: 'Operational'
};

fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
console.log(`🎉 [Success] Generated 843 stocks (KR: ${enrichedKR.length}, US: ${enrichedUS.length})!`);

