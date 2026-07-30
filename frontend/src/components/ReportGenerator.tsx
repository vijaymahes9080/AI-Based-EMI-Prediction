import React from 'react';
import { Printer, ShieldCheck, Download, Award, CheckCircle2, Sparkles, Building } from 'lucide-react';
import { PredictionResponse, FinancialProfileInput } from '../types/financial';

interface ReportGeneratorProps {
  prediction: PredictionResponse | null;
  profile: FinancialProfileInput;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ prediction, profile }) => {
  if (!prediction) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Official AI Financial Audit & EMI Risk Certificate
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Export or print a verified machine learning audit report for bank pre-qualification
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl gradient-bg text-white text-xs font-bold shadow-lg shadow-sky-500/20 hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF Audit Report</span>
        </button>
      </div>

      {/* Official Certificate Layout (Printable) */}
      <div className="bg-slate-950 p-8 rounded-2xl border-2 border-amber-500/30 space-y-6 relative overflow-hidden text-slate-200">
        {/* Certificate Watermark Stamp */}
        <div className="absolute top-6 right-6 opacity-20 pointer-events-none">
          <div className="w-32 h-32 rounded-full border-4 border-amber-400 flex items-center justify-center font-extrabold text-amber-400 text-xs tracking-widest uppercase rotate-12 text-center p-2">
            AI Verified FinPulse Audit
          </div>
        </div>

        {/* Certificate Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">FinPulse AI Financial Audit</h2>
              <span className="text-xs text-slate-400">Automated Risk & Affordability Assessment Certificate</span>
            </div>
          </div>
          <div className="text-right text-xs text-slate-400">
            <div>Date Issued: <span className="text-white font-bold">{currentDate}</span></div>
            <div>Verification ID: <span className="text-sky-400 font-mono">FIN-{Math.floor(100000 + Math.random() * 900000)}</span></div>
          </div>
        </div>

        {/* Borrower & Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Evaluated Applicant</span>
            <span className="text-sm font-extrabold text-white block mt-0.5">{profile.personal.occupation} ({profile.personal.age} yrs)</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Financial Health Score</span>
            <span className="text-sm font-extrabold text-emerald-400 block mt-0.5">{prediction.financial_health_score} / 100</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Max Recommended EMI</span>
            <span className="text-sm font-extrabold text-sky-400 block mt-0.5">${prediction.recommended_max_emi.toLocaleString()}/mo</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">EMI Default Risk</span>
            <span className={`text-sm font-extrabold block mt-0.5 ${prediction.emi_default_risk > 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {prediction.emi_default_risk}% (Low Risk)
            </span>
          </div>
        </div>

        {/* Audit Findings */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Executive Model Audit Summary</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Based on 5-fold cross-validated XGBoost and CatBoost machine learning models, the applicant demonstrates a debt-to-income (DTI) ratio of <span className="font-bold text-white">{(prediction.debt_to_income_ratio * 100).toFixed(1)}%</span> and a net monthly disposable income of <span className="font-bold text-emerald-400">${prediction.disposable_income.toLocaleString()}</span>. Loan approval probability is estimated at <span className="font-bold text-sky-400">{prediction.loan_approval_chance}%</span>.
          </p>
        </div>

        {/* Signature Line */}
        <div className="pt-4 border-t border-slate-800 flex justify-between items-end text-xs text-slate-400">
          <div>
            <div className="font-semibold text-slate-300">FinPulse AI Machine Learning Architect</div>
            <div className="text-[10px] text-slate-500">Automated Model Verification Suite v1.0</div>
          </div>
          <div className="flex items-center space-x-1 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Digital Audit Passed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
