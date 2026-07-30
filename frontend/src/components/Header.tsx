import React from 'react';
import { Activity, ShieldCheck, Cpu, BarChart3, Sliders, Zap, Sparkles, Building2, Award } from 'lucide-react';
import { CurrencySelector, CurrencyConfig } from './CurrencySelector';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: CurrencyConfig;
  onCurrencyChange: (c: CurrencyConfig) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currency,
  onCurrencyChange
}) => {
  const navItems = [
    { id: 'predictor', label: 'EMI & Risk Predictor', icon: Sparkles },
    { id: 'dashboard', label: 'Visual Analytics', icon: BarChart3 },
    { id: 'explainability', label: 'Explainable AI (SHAP)', icon: Cpu },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
    { id: 'stress', label: 'Stress Tester', icon: Activity },
    { id: 'optimizer', label: 'Debt Optimizer', icon: Building2 },
    { id: 'certificate', label: 'Audit Certificate', icon: Award },
    { id: 'metrics', label: 'ML Model Suite', icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('predictor')}>
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight gradient-text">FinPulse AI</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                v1.0 Pro
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Currency & Status */}
          <div className="flex items-center space-x-3">
            <CurrencySelector currentCurrency={currency} onCurrencyChange={onCurrencyChange} />
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="lg:hidden flex space-x-1 overflow-x-auto pb-3 pt-1 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium ${
                  isActive ? 'bg-sky-500 text-white' : 'bg-slate-800/50 text-slate-400'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
