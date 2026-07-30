import React, { useState } from 'react';
import { Activity, Cpu, CheckCircle, RefreshCw, BarChart2 } from 'lucide-react';
import { ModelMetricsSummary } from '../types/financial';

interface ModelMetricsViewProps {
  metrics: ModelMetricsSummary | null;
  onRetrain: () => void;
  isRetraining: boolean;
}

export const ModelMetricsView: React.FC<ModelMetricsViewProps> = ({ metrics, onRetrain, isRetraining }) => {
  const [selectedCategory, setSelectedCategory] = useState<'regression' | 'classification'>('regression');

  if (!metrics) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-slate-800 text-center space-y-4">
        <Activity className="w-10 h-10 text-sky-400 mx-auto animate-bounce" />
        <h3 className="text-lg font-bold text-white">Loading Machine Learning Benchmarks...</h3>
        <button
          onClick={onRetrain}
          className="px-4 py-2 rounded-xl gradient-bg text-white text-xs font-bold shadow-md shadow-sky-500/20"
        >
          Initialize Model Training
        </button>
      </div>
    );
  }

  const regMetrics = metrics.regression_metrics || {};
  const clsMetrics = metrics.classification_metrics || {};

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-400" />
            Machine Learning Pipeline & Model Evaluation Suite
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            5-Fold Cross Validation performance comparison across XGBoost, LightGBM, CatBoost, and Random Forest
          </p>
        </div>
        <button
          onClick={onRetrain}
          disabled={isRetraining}
          className="px-4 py-2 rounded-xl gradient-bg text-white text-xs font-extrabold shadow-lg shadow-sky-500/20 hover:opacity-90 transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRetraining ? 'animate-spin' : ''}`} />
          <span>{isRetraining ? 'Retraining ML Suite...' : 'Trigger Model Retraining'}</span>
        </button>
      </div>

      {/* Active Model Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">Best Regressor</span>
          <span className="text-base font-extrabold text-sky-400 mt-1 block">{metrics.best_regressor}</span>
          <span className="text-[10px] text-slate-500">Predicts Health Score & Max EMI</span>
        </div>
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">Best Classifier</span>
          <span className="text-base font-extrabold text-emerald-400 mt-1 block">{metrics.best_classifier}</span>
          <span className="text-[10px] text-slate-500">Predicts EMI Default Risk</span>
        </div>
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">Dataset Size</span>
          <span className="text-base font-extrabold text-purple-400 mt-1 block">{metrics.total_samples} samples</span>
          <span className="text-[10px] text-slate-500">Synthetic financial training records</span>
        </div>
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">Feature Dimensions</span>
          <span className="text-base font-extrabold text-amber-400 mt-1 block">{metrics.features_count} engineered</span>
          <span className="text-[10px] text-slate-500">Includes DTI, Cashflow & Stability index</span>
        </div>
      </div>

      {/* Category Toggle */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setSelectedCategory('regression')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedCategory === 'regression'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-white'
          }`}
        >
          Regression Models (Health Score & EMI)
        </button>
        <button
          onClick={() => setSelectedCategory('classification')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedCategory === 'classification'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-white'
          }`}
        >
          Classification Models (Default Risk)
        </button>
      </div>

      {/* Metrics Table */}
      <div className="overflow-x-auto">
        {selectedCategory === 'regression' ? (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">Model Algorithm</th>
                <th className="p-3">5-Fold CV R² Mean</th>
                <th className="p-3">MAE</th>
                <th className="p-3">RMSE</th>
                <th className="p-3">R² Score</th>
                <th className="p-3">MAPE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {Object.entries(regMetrics).map(([name, m]) => (
                <tr key={name} className={name === metrics.best_regressor ? 'bg-sky-500/10 font-bold text-white' : 'hover:bg-slate-900/40'}>
                  <td className="p-3 flex items-center space-x-2">
                    {name === metrics.best_regressor && <CheckCircle className="w-3.5 h-3.5 text-sky-400" />}
                    <span>{name}</span>
                  </td>
                  <td className="p-3 text-sky-400">{m.cv_r2_mean}</td>
                  <td className="p-3">{m.mae}</td>
                  <td className="p-3">{m.rmse}</td>
                  <td className="p-3 font-mono">{m.r2_score}</td>
                  <td className="p-3">{(m.mape * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">Model Algorithm</th>
                <th className="p-3">5-Fold CV F1 Mean</th>
                <th className="p-3">Accuracy</th>
                <th className="p-3">Precision</th>
                <th className="p-3">Recall</th>
                <th className="p-3">F1 Score</th>
                <th className="p-3">ROC-AUC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {Object.entries(clsMetrics).map(([name, m]) => (
                <tr key={name} className={name === metrics.best_classifier ? 'bg-emerald-500/10 font-bold text-white' : 'hover:bg-slate-900/40'}>
                  <td className="p-3 flex items-center space-x-2">
                    {name === metrics.best_classifier && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{name}</span>
                  </td>
                  <td className="p-3 text-emerald-400">{m.cv_f1_mean}</td>
                  <td className="p-3">{(m.accuracy * 100).toFixed(1)}%</td>
                  <td className="p-3">{(m.precision * 100).toFixed(1)}%</td>
                  <td className="p-3">{(m.recall * 100).toFixed(1)}%</td>
                  <td className="p-3 font-mono">{m.f1_score}</td>
                  <td className="p-3 font-mono text-purple-400">{m.roc_auc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
