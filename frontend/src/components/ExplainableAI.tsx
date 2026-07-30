import React from 'react';
import { Cpu, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { FeatureImportanceItem } from '../types/financial';

interface ExplainableAIProps {
  impacts: FeatureImportanceItem[];
}

export const ExplainableAI: React.FC<ExplainableAIProps> = ({ impacts }) => {
  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-400" />
            Explainable AI (SHAP Feature Attribution)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Local model breakdown showing how your specific attributes drove the Financial Health & Default Risk score
          </p>
        </div>
        <div className="hidden sm:flex items-center space-x-3 text-xs">
          <span className="flex items-center text-emerald-400 gap-1 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Positive Impact
          </span>
          <span className="flex items-center text-rose-400 gap-1 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Negative Impact
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {impacts.map((item, idx) => {
          const isPositive = item.direction === 'positive';
          const maxImpact = Math.max(...impacts.map(i => Math.abs(i.impact)), 1);
          const barWidth = Math.min(100, Math.max(12, (Math.abs(item.impact) / maxImpact) * 100));

          return (
            <div key={idx} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 font-bold text-slate-200">
                  {isPositive ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-rose-400" />
                  )}
                  <span>{item.feature}</span>
                </div>
                <span className={`font-mono font-extrabold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPositive ? '+' : ''}{item.impact.toFixed(1)} pts
                </span>
              </div>

              {/* Impact Bar */}
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isPositive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : 'bg-gradient-to-r from-rose-500 to-amber-500'
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              <div className="flex items-center text-[11px] text-slate-400 gap-1.5 pt-0.5">
                <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{item.description}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
