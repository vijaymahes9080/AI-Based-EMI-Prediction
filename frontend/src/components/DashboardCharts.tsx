import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { PredictionResponse, DashboardAnalytics, FinancialProfileInput } from '../types/financial';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler
);

interface DashboardChartsProps {
  prediction: PredictionResponse | null;
  profile: FinancialProfileInput | null;
  analytics: DashboardAnalytics | null;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  prediction,
  profile,
  analytics
}) => {
  // 1. Expense Breakdown Chart Data
  const exp = profile?.expenses || {
    house_rent: 22000,
    food_expenses: 12000,
    transportation: 4500,
    electricity_bill: 2500,
    internet_bill: 1200,
    insurance: 3500,
    shopping: 6500,
    entertainment: 4000
  };

  const expenseDoughnutData = {
    labels: ['House Rent', 'Food', 'Transportation', 'Utilities & Internet', 'Insurance', 'Shopping', 'Entertainment'],
    datasets: [
      {
        data: [
          exp.house_rent,
          exp.food_expenses,
          exp.transportation,
          exp.electricity_bill + exp.internet_bill,
          exp.insurance,
          exp.shopping,
          exp.entertainment
        ],
        backgroundColor: [
          '#0284c7',
          '#6366f1',
          '#10b981',
          '#f59e0b',
          '#ec4899',
          '#8b5cf6',
          '#64748b'
        ],
        borderWidth: 0
      }
    ]
  };

  // 2. Income vs Expenses Bar Chart Data
  const inc = profile?.income || { monthly_salary: 85000, additional_income: 8000, annual_bonus: 120000 };
  const totalInc = inc.monthly_salary + inc.additional_income + (inc.annual_bonus / 12);
  const totalLiving = Object.values(exp).reduce((a, b) => Number(a) + Number(b), 0);
  const totalEmi = (prediction?.predicted_monthly_emi || 16000) + (profile?.loans.home_loan_emi || 12000);

  const incomeVsExpenseData = {
    labels: ['Financial Breakdown'],
    datasets: [
      {
        label: 'Gross Monthly Income',
        data: [totalInc],
        backgroundColor: '#10b981'
      },
      {
        label: 'Living Expenses',
        data: [totalLiving],
        backgroundColor: '#f43f5e'
      },
      {
        label: 'Total EMI Obligations',
        data: [totalEmi],
        backgroundColor: '#0284c7'
      },
      {
        label: 'Net Monthly Savings',
        data: [prediction?.monthly_savings_after_emi || Math.max(0, totalInc - totalLiving - totalEmi)],
        backgroundColor: '#6366f1'
      }
    ]
  };

  // 3. 3, 6, 12 Month Trend Line Chart
  const trendLabels = prediction?.future_trends.map(t => t.month) || ['3 Months', '6 Months', '12 Months'];
  const trendSpending = prediction?.future_trends.map(t => t.predicted_spending) || [54000, 58000, 62000];
  const trendSavings = prediction?.future_trends.map(t => t.predicted_savings) || [41000, 39000, 36000];

  const trendLineData = {
    labels: trendLabels,
    datasets: [
      {
        label: 'Predicted Monthly Spending ($)',
        data: trendSpending,
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Predicted Net Savings ($)',
        data: trendSavings,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // 4. Credit Score vs Risk Curve
  const creditCurveData = {
    labels: analytics?.credit_score_risk_curve.map(c => c.credit_score) || [550, 620, 680, 740, 800, 850],
    datasets: [
      {
        label: 'Default Risk (%)',
        data: analytics?.credit_score_risk_curve.map(c => c.default_risk) || [78.5, 52.0, 28.4, 12.1, 4.2, 1.5],
        borderColor: '#f43f5e',
        tension: 0.4
      },
      {
        label: 'Approval Chance (%)',
        data: analytics?.credit_score_risk_curve.map(c => c.approval_rate) || [15.0, 35.0, 65.0, 88.0, 96.0, 99.0],
        borderColor: '#0284c7',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#94a3b8',
          font: { family: 'Plus Jakarta Sans', size: 11 }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Expense Breakdown */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Monthly Expense Distribution</h3>
        <div className="h-64 relative flex items-center justify-center">
          <Doughnut data={expenseDoughnutData} options={{ ...chartOptions, cutout: '70%' }} />
        </div>
      </div>

      {/* 2. Income vs Expenses Bar */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Income vs Obligations & Cash Flow</h3>
        <div className="h-64 relative">
          <Bar data={incomeVsExpenseData} options={chartOptions} />
        </div>
      </div>

      {/* 3. 3, 6, 12 Month Future Spending Trend */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Future Spending & Savings Trend (3, 6, 12 M)</h3>
        <div className="h-64 relative">
          <Line data={trendLineData} options={chartOptions} />
        </div>
      </div>

      {/* 4. Credit Score vs Risk Curve */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Credit Score vs Default Risk Benchmark</h3>
        <div className="h-64 relative">
          <Line data={creditCurveData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};
