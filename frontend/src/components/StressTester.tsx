import React, { useState } from 'react';
import { ShieldAlert, Activity, Play, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { FinancialProfileInput, PredictionResponse } from '../types/financial';

interface StressTesterProps {
  profile: FinancialProfileInput;
  prediction: PredictionResponse | null;
}

export const StressTester: React.FC<StressTesterProps> = ({ profile, prediction }) => {
  const [selectedScenario, setSelectedScenario] = useState<'baseline' | 'job_loss' | 'inflation' | 'rate_hike' | 'medical_shock'>('baseline');
  const [isSimulating, setIsSimulating] = useState(false);

  const totalIncome = profile.income.monthly_salary + profile.income.additional_income + (profile.income.annual_bonus / 12);
  const totalLiving = Object.values(profile.expenses).reduce((a, b) => Number(a) + Number(b), 0);
  const totalEmi = (prediction?.predicted_monthly_emi || 16000) + profile.loans.home_loan_emi + profile.loans.credit_card_emi;
  const liquidAssets = profile.banking.bank_balance + profile.banking.savings;

  // Scenario Multipliers & Shifts
  const scenarios = {
    baseline: {
      title: 'Baseline Economic Stability',
      description: 'Standard economic conditions with regular income & expenses.',
      incomeMult: 1.0,
      expenseMult: 1.0,
      emiMult: 1.0,
      shockCost: 0
    },
    job_loss: {
      title: 'Temporary Job Loss (4 Months)',
      description: 'Complete monthly salary interruption for 4 consecutive months.',
      incomeMult: 0.1,
      expenseMult: 0.85,
      emiMult: 1.0,
      shockCost: 0
    },
    inflation: {
      title: 'Severe Inflation Surge (+6%)',
      description: 'Global living expenses and utilities spike by 6% annually.',
      incomeMult: 1.0,
      expenseMult: 1.15,
      emiMult: 1.0,
      shockCost: 0
    },
    rate_hike: {
      title: 'Interest Rate Spike (+3.0%)',
      description: 'Central bank rate hikes increase variable interest rate to 13.5%.',
      incomeMult: 1.0,
      expenseMult: 1.0,
      emiMult: 1.28,
      shockCost: 0
    },
    medical_shock: {
      title: 'Emergency Health Shock',
      description: 'Unforeseen out-of-pocket medical procedure cost of $15,000.',
      incomeMult: 1.0,
      expenseMult: 1.05,
      emiMult: 1.0,
      shockCost: 15000
    }
  };

  const sc = scenarios[selectedScenario];
  const simIncome = totalIncome * sc.incomeMult;
  const simLiving = totalLiving * sc.expenseMult;
  const simEmi = totalEmi * sc.emiMult;
  const simCashFlow = simIncome - simLiving - simEmi;
  const adjustedAssets = Math.max(0, liquidAssets - sc.shockCost);

  // Survival buffer in months
  const monthlyBurn = simLiving + simEmi - simIncome;
  const survivalMonths = monthlyBurn > 0 ? (adjustedAssets / monthlyBurn).toFixed(1) : '∞ (Cash Positive)';

  // Simulated Default Probability
  const simDefaultRisk = Math.min(99, Math.max(2, Math.round(
    ((simLiving + simEmi) / (simIncome + 1e-5)) * 60 + (monthlyBurn > 0 ? 25 : -10)
  )));

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-400" />
            Monte Carlo Macroeconomic Stress Test & Survival Simulator
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Test your financial resilience against 1,000 simulated economic shock scenarios
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
          Risk Engine v1.0
        </span>
      </div>

      {/* Scenario Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {(Object.keys(scenarios) as Array<keyof typeof scenarios>).map(key => {
          const item = scenarios[key];
          const isSelected = selectedScenario === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedScenario(key)}
              className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-rose-500/20 border-rose-500/50 text-white shadow-lg shadow-rose-500/10'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-xs font-extrabold block mb-1">{item.title}</span>
              <span className="text-[10px] text-slate-400 leading-tight line-clamp-2">{item.description}</span>
            </button>
          );
        })}
      </div>

      {/* Stress Results Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Simulated Default Risk</span>
          <div className="flex items-center space-x-2">
            <span className={`text-3xl font-extrabold ${simDefaultRisk > 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {simDefaultRisk}%
            </span>
            {simDefaultRisk > 40 ? (
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
          </div>
          <p className="text-[11px] text-slate-400">Probability of default under this scenario</p>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Financial Survival Buffer</span>
          <div className="text-3xl font-extrabold text-sky-400">{survivalMonths}</div>
          <p className="text-[11px] text-slate-400">Months before liquid capital exhaustion</p>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Stressed Net Cash Flow</span>
          <div className={`text-3xl font-extrabold ${simCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${Math.round(simCashFlow).toLocaleString()}/mo
          </div>
          <p className="text-[11px] text-slate-400">Net cash flow after living & debt expenses</p>
        </div>
      </div>
    </div>
  );
};
