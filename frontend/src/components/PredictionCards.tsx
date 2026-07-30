import React from 'react';
import { DollarSign, ShieldCheck, Wallet, PiggyBank, TrendingUp, CheckCircle2 } from 'lucide-react';
import { PredictionResponse } from '../types/financial';

interface PredictionCardsProps {
  prediction: PredictionResponse;
}

export const PredictionCards: React.FC<PredictionCardsProps> = ({ prediction }) => {
  const cards = [
    {
      title: 'Proposed Monthly EMI',
      value: `$${prediction.predicted_monthly_emi.toLocaleString()}`,
      subtext: 'Calculated monthly debt commitment',
      icon: DollarSign,
      color: 'from-sky-500/20 to-indigo-500/20 border-sky-500/30 text-sky-400'
    },
    {
      title: 'Recommended Max EMI',
      value: `$${prediction.recommended_max_emi.toLocaleString()}`,
      subtext: 'Safe ceiling based on net disposable income',
      icon: ShieldCheck,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400'
    },
    {
      title: 'Net Monthly Savings',
      value: `$${prediction.monthly_savings_after_emi.toLocaleString()}`,
      subtext: 'Cash cushion after living & debt expenses',
      icon: Wallet,
      color: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-400'
    },
    {
      title: 'Net Disposable Income',
      value: `$${prediction.disposable_income.toLocaleString()}`,
      subtext: 'Gross income minus fixed essential expenses',
      icon: PiggyBank,
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400'
    },
    {
      title: 'Investment Capacity',
      value: `$${prediction.investment_capacity.toLocaleString()}`,
      subtext: 'Suggested monthly wealth building budget',
      icon: TrendingUp,
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400'
    },
    {
      title: 'Budget Discipline Score',
      value: `${prediction.budget_score} / 100`,
      subtext: 'Ratio of savings and emergency buffer',
      icon: CheckCircle2,
      color: 'from-teal-500/20 to-emerald-500/20 border-teal-500/30 text-teal-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`glass-card glass-card-hover rounded-2xl p-5 border bg-gradient-to-br ${card.color} flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{card.title}</span>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white tracking-tight mb-1">{card.value}</div>
              <p className="text-xs text-slate-400">{card.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
