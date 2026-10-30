import React from 'react';
import { Crown, Rocket, TrendingUp, ShieldCheck } from 'lucide-react';
import { STRATEGIES } from '../../utils/strategies';

const iconMap = {
  Crown,
  Rocket,
  TrendingUp,
  ShieldCheck
};

export default function StrategyBadge({ strategyKey }) {
  const strategy = STRATEGIES[strategyKey];
  if (!strategy) return null;

  const Icon = iconMap[strategy.icon];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${strategy.badgeClass}`}
      title={strategy.description}
    >
      {Icon && <Icon className="w-2.5 h-2.5" />}
      <span>{strategy.shortName}</span>
    </span>
  );
}

