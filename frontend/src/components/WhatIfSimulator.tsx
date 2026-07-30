import React, { useState } from 'react';
import { Sliders, RefreshCw, Zap, TrendingUp } from 'lucide-react';
import { FinancialProfileInput, PredictionResponse } from '../types/financial';

interface WhatIfSimulatorProps {
  initialProfile: FinancialProfileInput;
  initialPrediction: PredictionResponse;
  onSimulate: (updatedProfile: FinancialProfileInput) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  initialProfile,
  initialPrediction,
  onSimulate
}) => {
  const [rent, setRent] = useState(initialProfile.expenses.house_rent);
  const [creditScore, setCreditScore] = useState(initialProfile.banking.credit_score);
  const [loanTenure, setLoanTenure] = useState(initialProfile.loans.loan_tenure_months);
  const [loanAmount, setLoanAmount] = useState(initialProfile.loans.loan_amount);

  // Real-time recalculation estimate
  const monthlySalary = initialProfile.income.monthly_salary;

  const r = (initialProfile.loans.interest_rate) / (12 * 100);
  const simEmi = loanAmount > 0 && loanTenure > 0
    ? Math.round(loanAmount * r * Math.pow(1 + r, loanTenure) / (Math.pow(1 + r, loanTenure) - 1))
    : 0;

  const totalLiving = initialProfile.expenses.food_expenses + rent + initialProfile.expenses.transportation + initialProfile.expenses.shopping;
  const totalEmi = simEmi + initialProfile.loans.home_loan_emi + initialProfile.loans.credit_card_emi;
  const simDti = totalEmi / (monthlySalary + 1e-5);
  const simHealth = Math.min(99, Math.max(10, Math.round(
    (creditScore / 850) * 40 + (1 - Math.min(simDti, 1.2)) * 40 + 15
  )));

  const handleApplySim = () => {
    const updated: FinancialProfileInput = {
      ...initialProfile,
      expenses: { ...initialProfile.expenses, house_rent: rent },
      banking: { ...initialProfile.banking, credit_score: creditScore },
      loans: { ...initialProfile.loans, loan_tenure_months: loanTenure, loan_amount: loanAmount }
    };
    onSimulate(updated);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-400" />
            Interactive "What-If" Financial Scenario Simulator
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Adjust sliders to see live real-time recalculations of your Financial Health Index and proposed EMI
          </p>
        </div>
        <button
          onClick={handleApplySim}
          className="px-4 py-2 rounded-xl gradient-bg text-white text-xs font-bold shadow-lg shadow-sky-500/20 hover:opacity-90 transition-all flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Run Full ML Re-Inference
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sliders Column */}
        <div className="space-y-5">
          {/* House Rent */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-slate-300">House Rent / Housing Expense</span>
              <span className="text-sky-400">${rent.toLocaleString()} / mo</span>
            </div>
            <input
              type="range"
              min="5000"
              max="50000"
              step="1000"
              value={rent}
              onChange={e => setRent(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          {/* Credit Score */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-slate-300">Credit Score Rating</span>
              <span className="text-sky-400">{creditScore} / 850</span>
            </div>
            <input
              type="range"
              min="300"
              max="850"
              step="10"
              value={creditScore}
              onChange={e => setCreditScore(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          {/* Loan Amount */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-slate-300">Proposed Loan Amount</span>
              <span className="text-sky-400">${loanAmount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="100000"
              max="3000000"
              step="50000"
              value={loanAmount}
              onChange={e => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          {/* Loan Tenure */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-slate-300">Loan Tenure</span>
              <span className="text-sky-400">{loanTenure} Months ({Math.round(loanTenure/12)} Yrs)</span>
            </div>
            <input
              type="range"
              min="12"
              max="360"
              step="12"
              value={loanTenure}
              onChange={e => setLoanTenure(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>
        </div>

        {/* Real-time Recalculated Output Box */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Simulated Impact Summary</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                <span className="text-[11px] font-semibold text-slate-400 block">Simulated Health Score</span>
                <span className={`text-2xl font-extrabold ${simHealth >= 70 ? 'text-emerald-400' : simHealth >= 50 ? 'text-sky-400' : 'text-rose-400'}`}>
                  {simHealth} <span className="text-xs font-normal text-slate-400">/ 100</span>
                </span>
              </div>
              <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                <span className="text-[11px] font-semibold text-slate-400 block">Simulated Monthly EMI</span>
                <span className="text-2xl font-extrabold text-sky-400">
                  ${simEmi.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Simulated DTI Ratio:</span>
                <span className={`font-bold ${simDti > 0.45 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {(simDti * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${simDti > 0.45 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                  style={{ width: `${Math.min(100, simDti * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic mt-4">
            * Note: Instant calculation estimates key ratio shifts. Click "Run Full ML Re-Inference" to update full SHAP & recommendations pipeline.
          </p>
        </div>
      </div>
    </div>
  );
};
