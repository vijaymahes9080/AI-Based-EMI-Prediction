import React, { useState } from 'react';
import { Building2, ArrowRight, DollarSign, Zap, Percent, Check } from 'lucide-react';
import { FinancialProfileInput } from '../types/financial';

interface LoanOptimizerProps {
  profile: FinancialProfileInput;
}

export const LoanOptimizer: React.FC<LoanOptimizerProps> = ({ profile }) => {
  const [strategy, setStrategy] = useState<'avalanche' | 'snowball'>('avalanche');

  const loans = [
    { name: 'Credit Card Debt', balance: 180000, rate: 22.0, emi: profile.loans.credit_card_emi || 2000 },
    { name: 'Personal Loan', balance: 350000, rate: 14.5, emi: profile.loans.personal_loan_emi || 5000 },
    { name: 'Vehicle Loan', balance: 450000, rate: 9.5, emi: profile.loans.vehicle_loan_emi || 4000 },
    { name: 'Home Loan', balance: 2500000, rate: 8.5, emi: profile.loans.home_loan_emi || 12000 }
  ].filter(l => l.emi > 0 || l.balance > 0);

  const totalBalance = loans.reduce((acc, l) => acc + l.balance, 0);
  const totalEmi = loans.reduce((acc, l) => acc + l.emi, 0);

  // Strategy Calculations
  const sortedLoans = [...loans].sort((a, b) => strategy === 'avalanche' ? b.rate - a.rate : a.balance - b.balance);

  // Consolidated Refinancing Option: Replace high-interest debt with single low-interest 9.5% loan
  const consolidatedRate = 9.5;
  const consolidatedTenure = 48; // months
  const r = consolidatedRate / (12 * 100);
  const consolidatedEmi = Math.round(totalBalance * r * Math.pow(1 + r, consolidatedTenure) / (Math.pow(1 + r, consolidatedTenure) - 1));
  const totalInterestOld = Math.round(totalBalance * 0.38);
  const totalInterestNew = Math.round((consolidatedEmi * consolidatedTenure) - totalBalance);
  const totalSavings = Math.max(0, totalInterestOld - totalInterestNew);

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            AI Debt Consolidation & Interest Optimization Engine
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Optimize your multi-loan repayment strategy to save interest and eliminate debt faster
          </p>
        </div>
        <div className="flex space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setStrategy('avalanche')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              strategy === 'avalanche' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Debt Avalanche (High Interest First)
          </button>
          <button
            onClick={() => setStrategy('snowball')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              strategy === 'snowball' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Debt Snowball (Small Balance First)
          </button>
        </div>
      </div>

      {/* Active Loan Breakdown Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold text-[10px]">
            <tr>
              <th className="p-3">Priority Rank</th>
              <th className="p-3">Loan Account</th>
              <th className="p-3">Est. Principal Balance</th>
              <th className="p-3">Interest Rate APR</th>
              <th className="p-3">Current EMI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sortedLoans.map((l, idx) => (
              <tr key={idx} className="hover:bg-slate-900/40">
                <td className="p-3 font-bold text-sky-400">#{idx + 1}</td>
                <td className="p-3 font-semibold text-white">{l.name}</td>
                <td className="p-3">${l.balance.toLocaleString()}</td>
                <td className="p-3 text-rose-400 font-mono font-bold">{l.rate}%</td>
                <td className="p-3 text-sky-300 font-bold">${l.emi.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Refinancing Comparison Box */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 block mb-1">AI Recommendation</span>
          <h4 className="text-base font-extrabold text-white">Single Consolidated Debt Refinance</h4>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Combine your loans into a single low-interest rate loan at <span className="text-emerald-400 font-bold">9.5% APR</span> over 48 months to reduce monthly EMI strain.
          </p>
        </div>
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center shrink-0">
          <span className="text-[11px] font-bold text-slate-400 block">Est. Interest Savings</span>
          <span className="text-2xl font-extrabold text-emerald-400">${totalSavings.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
