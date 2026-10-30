import React from 'react';
import { getReturnColorClass, formatPercent, formatMultiple } from '../../utils/formatters';

export default function MetricBadge({ label, value, type = 'percent' }) {
  let formattedValue = value;
  let colorClass = 'text-slate-200';

  if (type === 'percent') {
    formattedValue = formatPercent(value);
    colorClass = getReturnColorClass(value);
  } else if (type === 'multiple') {
    formattedValue = formatMultiple(value);
  } else if (type === 'ratio') {
    formattedValue = `${value}%`;
  }

  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{label}</span>
      <span className={`text-xs font-bold font-mono ${colorClass}`}>{formattedValue}</span>
    </div>
  );
}

