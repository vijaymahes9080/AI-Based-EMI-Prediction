import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { HealthGauge } from './components/HealthGauge';
import { PredictionCards } from './components/PredictionCards';
import { ExplainableAI } from './components/ExplainableAI';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { DashboardCharts } from './components/DashboardCharts';
import { ModelMetricsView } from './components/ModelMetricsView';
import { financialApi } from './services/api';
import { FinancialProfileInput, PredictionResponse, DashboardAnalytics, ModelMetricsSummary } from './types/financial';
import { Lightbulb, AlertTriangle, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

const DEFAULT_PROFILE: FinancialProfileInput = {
  personal: {
    age: 32,
    gender: 'Male',
    occupation: 'Software Engineer',
    employment_type: 'Salaried',
    marital_status: 'Married',
    number_of_dependents: 1
  },
  income: {
    monthly_salary: 85000,
    additional_income: 8000,
    annual_bonus: 120000,
    business_income: 0
  },
  expenses: {
    house_rent: 22000,
    food_expenses: 12000,
    transportation: 4500,
    electricity_bill: 2500,
    internet_bill: 1200,
    insurance: 3500,
    education: 4000,
    medical_expenses: 2500,
    entertainment: 4000,
    shopping: 6500,
    other_expenses: 3000
  },
  loans: {
    loan_type: 'Home Loan',
    loan_amount: 600000,
    interest_rate: 10.5,
    loan_tenure_months: 36,
    existing_emi: 4000,
    credit_card_emi: 2000,
    personal_loan_emi: 0,
    home_loan_emi: 12000,
    vehicle_loan_emi: 0
  },
  banking: {
    credit_score: 760,
    bank_balance: 180000,
    savings: 250000,
    investments: 350000
  },
  lifestyle: {
    smoking: 'No',
    alcohol: 'Occasionally',
    travel_frequency: 'Moderate',
    online_shopping_frequency: 'High'
  }
};

export function App() {
  const [activeTab, setActiveTab] = useState<string>('predictor');
  const [profile, setProfile] = useState<FinancialProfileInput>(DEFAULT_PROFILE);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [metrics, setMetrics] = useState<ModelMetricsSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRetraining, setIsRetraining] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const predRes = await financialApi.predict(DEFAULT_PROFILE);
      setPrediction(predRes);

      const [dashRes, metricsRes] = await Promise.all([
        financialApi.getDashboardData().catch(() => null),
        financialApi.getMetrics().catch(() => null)
      ]);
      if (dashRes) setAnalytics(dashRes);
      if (metricsRes) setMetrics(metricsRes);
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Could not connect to FastAPI Backend. Ensuring models are compiled...");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredictSubmit = async (inputProfile: FinancialProfileInput) => {
    setProfile(inputProfile);
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await financialApi.predict(inputProfile);
      setPrediction(res);
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Prediction calculation failed. Please check backend log.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetrain = async () => {
    setIsRetraining(true);
    try {
      await financialApi.trainModels();
      const updatedMetrics = await financialApi.getMetrics();
      setMetrics(updatedMetrics);
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Model retraining failed.");
    } finally {
      setIsRetraining(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {errorMessage && (
        <div className="max-w-7xl mx-auto px-4 mt-4 w-full">
          <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl text-rose-400 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="hover:underline">Dismiss</button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* TAB 1: EMI & RISK PREDICTOR */}
        {activeTab === 'predictor' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <InputForm onSubmit={handlePredictSubmit} isLoading={isLoading} />
              </div>
              <div>
                {prediction ? (
                  <HealthGauge
                    healthScore={prediction.financial_health_score}
                    defaultRisk={prediction.emi_default_risk}
                    approvalChance={prediction.loan_approval_chance}
                    dtiRatio={prediction.debt_to_income_ratio}
                  />
                ) : (
                  <div className="glass-card rounded-2xl p-6 text-center animate-pulse h-full flex flex-col justify-center">
                    <Sparkles className="w-8 h-8 text-sky-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Computing ML Prediction...</p>
                  </div>
                )}
              </div>
            </div>

            {prediction && (
              <>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Predicted Financial Health Indicators</h3>
                  <PredictionCards prediction={prediction} />
                </div>

                {/* AI Recommendations Hub */}
                <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-amber-400" />
                      Personalized AI Financial Recommendations
                    </h3>
                    <span className="text-xs text-slate-400">{prediction.recommendations.length} Actionable Steps</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prediction.recommendations.map((rec, idx) => {
                      const isHigh = rec.severity === 'High';
                      const isMed = rec.severity === 'Medium';
                      const isPos = rec.severity === 'Positive';
                      return (
                        <div key={idx} className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400">{rec.category}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isHigh ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                                isMed ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                                'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              }`}>
                                {rec.severity} Priority
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white mb-1">{rec.title}</h4>
                            <p className="text-xs text-slate-400">{rec.description}</p>
                          </div>
                          <div className="pt-3 border-t border-slate-800/60 mt-2">
                            <span className="text-[11px] font-bold text-sky-300 block">Action Item:</span>
                            <p className="text-xs text-slate-300 font-medium mt-0.5">{rec.action_item}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <ExplainableAI impacts={prediction.top_feature_impacts} />
              </>
            )}
          </div>
        )}

        {/* TAB 2: VISUAL ANALYTICS */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <DashboardCharts prediction={prediction} profile={profile} analytics={analytics} />
          </div>
        )}

        {/* TAB 3: EXPLAINABLE AI (SHAP) */}
        {activeTab === 'explainability' && (
          <div className="space-y-6">
            {prediction ? (
              <ExplainableAI impacts={prediction.top_feature_impacts} />
            ) : (
              <div className="glass-card p-8 text-center text-slate-400">Run a prediction first to generate local SHAP attributions.</div>
            )}
          </div>
        )}

        {/* TAB 4: WHAT-IF SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            {prediction ? (
              <WhatIfSimulator
                initialProfile={profile}
                initialPrediction={prediction}
                onSimulate={handlePredictSubmit}
              />
            ) : (
              <div className="glass-card p-8 text-center text-slate-400">Run a prediction first to enable the What-If Simulator.</div>
            )}
          </div>
        )}

        {/* TAB 5: MODEL METRICS VIEW */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <ModelMetricsView metrics={metrics} onRetrain={handleRetrain} isRetraining={isRetraining} />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 FinPulse AI - Production-Ready EMI & Financial Health Machine Learning Architecture</span>
          <span className="text-sky-500 font-semibold">FastAPI • Scikit-Learn • XGBoost • LightGBM • CatBoost • React</span>
        </div>
      </footer>
    </div>
  );
}
