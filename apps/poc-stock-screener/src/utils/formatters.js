/**
 * 숫자 및 금융 지표 포맷팅 유틸리티
 */

export function formatPrice(value, market = 'us') {
  if (value === undefined || value === null) return '-';
  if (market === 'us') {
    return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${Number(value).toLocaleString('ko-KR')}원`;
}

export function formatPercent(value, showSign = true) {
  if (value === undefined || value === null) return '-';
  const num = Number(value);
  const sign = showSign && num > 0 ? '+' : '';
  return `${sign}${num.toFixed(1)}%`;
}

export function formatMultiple(value) {
  if (value === undefined || value === null) return '-';
  const num = Number(value);
  if (num <= 0) return '적자';
  return `${num.toFixed(1)}배`;
}

export function getReturnColorClass(value) {
  const num = Number(value || 0);
  if (num > 0) return 'text-rose-400';
  if (num < 0) return 'text-sky-400';
  return 'text-slate-400';
}

export function getReturnBgClass(value) {
  const num = Number(value || 0);
  if (num > 0) return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  if (num < 0) return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
  return 'bg-slate-800 text-slate-400 border-slate-700';
}

