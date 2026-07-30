import React from 'react';
import { ShieldAlert, ShieldCheck, Award, TrendingUp } from 'lucide-react';

interface HealthGaugeProps {
  healthScore: number;
  defaultRisk: number;
  approvalChance: number;
  dtiRatio: number;
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({
  healthScore,
  defaultRisk,
  approvalChance,
  dtiRatio
}) => {
  const getHealthBadge = (score: number) => {
    if (score >= 80) return { label: 'Exceptional Financial Health', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 65) return { label: 'Good Financial Standing', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' };
    if (score >= 50) return { label: 'Moderate Financial Buffer', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { label: 'High Financial Vulnerability', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const badge = getHealthBadge(healthScore);

  // SVG Gauge calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * (circumference * 0.75);

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">ML Financial Health Index</h3>
          <p className="text-xs text-slate-500">Multivariate model evaluation</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg} ${badge.color}`}>
          {badge.label}
        </div>
      </div>

      {/* SVG Gauge */}
      <div className="relative flex items-center justify-center my-4">
        <svg className="w-52 h-52 transform -rotate-135" viewBox="0 0 180 180">
          <circle
            cx="90"
            cy="90"
            r={radius}
            className="text-slate-800"
            strokeWidth="14"
            stroke="currentColor"
            fill="transparent"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeLinecap="round"
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            className="transition-all duration-1000 ease-out"
            strokeWidth="14"
            stroke="url(#healthGradient)"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold tracking-tight text-white">{healthScore}</span>
          <span className="text-xs font-semibold text-slate-400 mt-0.5">out of 100</span>
        </div>
      </div>

      {/* Sub Metrics Matrix */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800/80">
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60 text-center">
          <span className="text-[10px] font-semibold text-slate-400 block uppercase">Default Risk</span>
          <span className={`text-sm font-bold ${defaultRisk > 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {defaultRisk}%
          </span>
        </div>
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60 text-center">
          <span className="text-[10px] font-semibold text-slate-400 block uppercase">Approval Chance</span>
          <span className="text-sm font-bold text-sky-400">
            {approvalChance}%
          </span>
        </div>
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60 text-center">
          <span className="text-[10px] font-semibold text-slate-400 block uppercase">DTI Ratio</span>
          <span className={`text-sm font-bold ${dtiRatio > 0.45 ? 'text-amber-400' : 'text-slate-200'}`}>
            {(dtiRatio * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};
