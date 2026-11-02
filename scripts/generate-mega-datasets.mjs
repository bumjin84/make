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

// 기존 30개 검증된 실제 정밀 데이터셋 캐시 로드
const oldUsMap = new Map();
if (fs.existsSync(usDataPath)) {
  try {
    const oldUs = JSON.parse(fs.readFileSync(usDataPath, 'utf8'));
    oldUs.forEach(s => {
      // 신규 합성 데이터가 아닌 기존 검증 데이터만 로드
      if (s.reasoning && !s.reasoning.includes('주요 섹터 핵심 종목')) {
        oldUsMap.set(s.ticker, s);
      }
    });
  } catch {}
}

const oldKrMap = new Map();
if (fs.existsSync(krDataPath)) {
  try {
    const oldKr = JSON.parse(fs.readFileSync(krDataPath, 'utf8'));
    oldKr.forEach(s => {
      if (s.reasoning && !s.reasoning.includes('시장 지배력 보유')) {
        oldKrMap.set(s.ticker, s);
      }
    });
  } catch {}
}

const universe = JSON.parse(fs.readFileSync(universePath, 'utf8'));

// 1. 국내장 (KOSPI 200 + KOSDAQ 150 = 350개) 정제
const enrichedKR = [...universe.kospi, ...universe.kosdaq].map((item) => {
  const isETF = checkIsETF(item.name);
  const cached = oldKrMap.get(item.ticker);

  if (cached && !isETF) {
    return {
      ...cached,
      market: 'kr',
      subMarket: item.market,
      isETF: false
    };
  }

  // ETF/펀드 상품인 경우: 기업 재무제표를 일체 넣지 않고 null(없음)로 정직하게 설정
  if (isETF) {
    return {
      ticker: item.ticker,
      name: item.name,
      market: 'kr',
      subMarket: item.market,
      sector: 'ETF/상장지수펀드',
      isETF: true,
      price: item.price || 0,
      marketCap: item.marketCap || '-',
      pe: null,
      forwardPe: null,
      roe: null,
      operatingMargin: null,
      dividendYield: null,
      return3M: null,
      return1Y: null,
      consensusGrowth: null,
      debtRatio: null,
      priceToHigh52w: null,
      reasoning: '상장지수펀드(ETF) 상품으로 개별 기업 재무제표(PER, ROE 등)가 제공되지 않습니다.',
      daily: null,
      trendAnalysis: null
    };
  }

  // 일반 주식이지만 아직 실시간 상세 재무가 크롤링되지 않은 경우: 가짜 숫자를 넣지 않고 null 처리
  return {
    ticker: item.ticker,
    name: item.name,
    market: 'kr',
    subMarket: item.market,
    sector: item.market === 'kospi' ? '코스피 상장주' : '코스닥 상장주',
    isETF: false,
    price: item.price || 0,
    marketCap: item.marketCap || '-',
    pe: null,
    forwardPe: null,
    roe: null,
    operatingMargin: null,
    dividendYield: null,
    return3M: null,
    return1Y: null,
    consensusGrowth: null,
    debtRatio: null,
    priceToHigh52w: null,
    reasoning: `${item.name} (${item.market.toUpperCase()} 시가총액 상위 기업)`,
    daily: null,
    trendAnalysis: null
  };
});

// 2. 미국장 (S&P 500 493개) 정제
const enrichedUS = universe.sp500.map((item) => {
  const cached = oldUsMap.get(item.ticker);

  if (cached) {
    return {
      ...cached,
      market: 'us',
      subMarket: 'sp500',
      isETF: false
    };
  }

  return {
    ticker: item.ticker,
    name: item.name,
    market: 'us',
    subMarket: 'sp500',
    sector: item.sector || 'S&P 500',
    isETF: false,
    price: null,
    marketCap: 'S&P 500',
    pe: null,
    forwardPe: null,
    roe: null,
    operatingMargin: null,
    dividendYield: null,
    return3M: null,
    return1Y: null,
    consensusGrowth: null,
    debtRatio: null,
    priceToHigh52w: null,
    reasoning: `${item.name} (미국 S&P 500 ${item.sector || '주요'} 섹터 상장 종목)`,
    daily: null,
    trendAnalysis: null
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
console.log(`🎉 [Cleaned Datasets] Successfully saved: Total ${metadata.totalCount} stocks (All fake data removed, nulls preserved)`);
