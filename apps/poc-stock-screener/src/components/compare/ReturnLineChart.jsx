import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function ReturnLineChart({ chartData, stockA, stockB }) {
  if (!chartData || !stockA || !stockB) return null;

  return (
    <div className="w-full h-52 sm:h-64 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] font-semibold text-slate-400">
          기준 100 정규화 최근 3개월 상대 수익률 궤적
        </span>
        <div className="flex items-center gap-3 text-xs font-mono font-medium">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            {stockA.ticker} ({stockA.name})
          </span>
          <span className="flex items-center gap-1 text-indigo-400">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
            {stockB.ticker} ({stockB.name})
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="88%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.75rem',
              fontSize: '11px',
              color: '#f8fafc'
            }}
          />
          <Line
            type="monotone"
            dataKey={stockA.ticker}
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#10b981' }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey={stockB.ticker}
            stroke="#818cf8"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#818cf8' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

