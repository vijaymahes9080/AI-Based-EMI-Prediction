import React, { useState, useEffect } from 'react';
import { User, DollarSign, CreditCard, Building2, HeartPulse, Sparkles, Zap } from 'lucide-react';
import { FinancialProfileInput } from '../types/financial';

interface InputFormProps {
  onSubmit: (data: FinancialProfileInput) => void;
  isLoading: boolean;
}

const DEFAULT_FORM: FinancialProfileInput = {
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

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FinancialProfileInput>(DEFAULT_FORM);
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [isAutoReactive, setIsAutoReactive] = useState<boolean>(true);

  // Real-time Reactive Trigger on all field updates
  const handleNestedChange = (category: keyof FinancialProfileInput, field: string, rawVal: any) => {
    const val = typeof rawVal === 'string' && !isNaN(Number(rawVal)) && rawVal !== '' ? Number(rawVal) : rawVal;

    const updated = {
      ...formData,
      [category]: {
        ...formData[category],
        [field]: val
      }
    };
    setFormData(updated);

    if (isAutoReactive) {
      onSubmit(updated);
    }
  };

  const handleAutoFill = () => {
    setFormData(DEFAULT_FORM);
    onSubmit(DEFAULT_FORM);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const sections = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'income', label: 'Income', icon: DollarSign },
    { id: 'expenses', label: 'Expenses', icon: CreditCard },
    { id: 'loans', label: 'Loans & EMI', icon: Building2 },
    { id: 'banking', label: 'Banking', icon: HeartPulse },
    { id: 'lifestyle', label: 'Lifestyle', icon: Sparkles }
  ];

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-sky-400" />
            Reactive Financial Profile Evaluator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time inference engine - Model recalculates instantly on every field modification
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsAutoReactive(!isAutoReactive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isAutoReactive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {isAutoReactive ? '⚡ Auto-Reactive ON' : 'Manual Trigger'}
          </button>
          <button
            type="button"
            onClick={handleAutoFill}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Auto-Fill Demo Profile
          </button>
        </div>
      </div>

      {/* Section Selector Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {sections.map(s => {
          const Icon = s.icon;
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        {activeSection === 'personal' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Age ({formData.personal.age} yrs)</label>
              <input
                type="number"
                min="18"
                max="100"
                value={formData.personal.age}
                onChange={e => handleNestedChange('personal', 'age', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Gender</label>
              <select
                value={formData.personal.gender}
                onChange={e => handleNestedChange('personal', 'gender', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Occupation</label>
              <input
                type="text"
                value={formData.personal.occupation}
                onChange={e => handleNestedChange('personal', 'occupation', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Employment Type</label>
              <select
                value={formData.personal.employment_type}
                onChange={e => handleNestedChange('personal', 'employment_type', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Salaried">Salaried</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Business">Business</option>
                <option value="Unemployed">Unemployed</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Marital Status</label>
              <select
                value={formData.personal.marital_status}
                onChange={e => handleNestedChange('personal', 'marital_status', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Number of Dependents</label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.personal.number_of_dependents}
                onChange={e => handleNestedChange('personal', 'number_of_dependents', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        )}

        {/* Income Details */}
        {activeSection === 'income' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Monthly Salary ($)</label>
              <input
                type="number"
                value={formData.income.monthly_salary}
                onChange={e => handleNestedChange('income', 'monthly_salary', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Additional Income ($)</label>
              <input
                type="number"
                value={formData.income.additional_income}
                onChange={e => handleNestedChange('income', 'additional_income', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Annual Bonus ($)</label>
              <input
                type="number"
                value={formData.income.annual_bonus}
                onChange={e => handleNestedChange('income', 'annual_bonus', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Business Income ($)</label>
              <input
                type="number"
                value={formData.income.business_income}
                onChange={e => handleNestedChange('income', 'business_income', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        )}

        {/* Expenses Details */}
        {activeSection === 'expenses' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">House Rent ($)</label>
              <input
                type="number"
                value={formData.expenses.house_rent}
                onChange={e => handleNestedChange('expenses', 'house_rent', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Food Expenses ($)</label>
              <input
                type="number"
                value={formData.expenses.food_expenses}
                onChange={e => handleNestedChange('expenses', 'food_expenses', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Transportation ($)</label>
              <input
                type="number"
                value={formData.expenses.transportation}
                onChange={e => handleNestedChange('expenses', 'transportation', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Electricity Bill ($)</label>
              <input
                type="number"
                value={formData.expenses.electricity_bill}
                onChange={e => handleNestedChange('expenses', 'electricity_bill', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Internet Bill ($)</label>
              <input
                type="number"
                value={formData.expenses.internet_bill}
                onChange={e => handleNestedChange('expenses', 'internet_bill', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Insurance ($)</label>
              <input
                type="number"
                value={formData.expenses.insurance}
                onChange={e => handleNestedChange('expenses', 'insurance', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Education ($)</label>
              <input
                type="number"
                value={formData.expenses.education}
                onChange={e => handleNestedChange('expenses', 'education', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Medical Expenses ($)</label>
              <input
                type="number"
                value={formData.expenses.medical_expenses}
                onChange={e => handleNestedChange('expenses', 'medical_expenses', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Entertainment ($)</label>
              <input
                type="number"
                value={formData.expenses.entertainment}
                onChange={e => handleNestedChange('expenses', 'entertainment', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Shopping ($)</label>
              <input
                type="number"
                value={formData.expenses.shopping}
                onChange={e => handleNestedChange('expenses', 'shopping', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Other Expenses ($)</label>
              <input
                type="number"
                value={formData.expenses.other_expenses}
                onChange={e => handleNestedChange('expenses', 'other_expenses', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        )}

        {/* Loans Details */}
        {activeSection === 'loans' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Proposed Loan Type</label>
              <select
                value={formData.loans.loan_type}
                onChange={e => handleNestedChange('loans', 'loan_type', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Home Loan">Home Loan</option>
                <option value="Personal Loan">Personal Loan</option>
                <option value="Vehicle Loan">Vehicle Loan</option>
                <option value="Education Loan">Education Loan</option>
                <option value="Business Loan">Business Loan</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Proposed Loan Amount ($)</label>
              <input
                type="number"
                value={formData.loans.loan_amount}
                onChange={e => handleNestedChange('loans', 'loan_amount', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.loans.interest_rate}
                onChange={e => handleNestedChange('loans', 'interest_rate', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Tenure (Months)</label>
              <input
                type="number"
                value={formData.loans.loan_tenure_months}
                onChange={e => handleNestedChange('loans', 'loan_tenure_months', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Existing Home EMI ($)</label>
              <input
                type="number"
                value={formData.loans.home_loan_emi}
                onChange={e => handleNestedChange('loans', 'home_loan_emi', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Existing Credit Card EMI ($)</label>
              <input
                type="number"
                value={formData.loans.credit_card_emi}
                onChange={e => handleNestedChange('loans', 'credit_card_emi', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        )}

        {/* Banking Details */}
        {activeSection === 'banking' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Credit Score (300-850)</label>
              <input
                type="number"
                min="300"
                max="850"
                value={formData.banking.credit_score}
                onChange={e => handleNestedChange('banking', 'credit_score', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Bank Balance ($)</label>
              <input
                type="number"
                value={formData.banking.bank_balance}
                onChange={e => handleNestedChange('banking', 'bank_balance', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Savings ($)</label>
              <input
                type="number"
                value={formData.banking.savings}
                onChange={e => handleNestedChange('banking', 'savings', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Investments ($)</label>
              <input
                type="number"
                value={formData.banking.investments}
                onChange={e => handleNestedChange('banking', 'investments', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        )}

        {/* Lifestyle Details */}
        {activeSection === 'lifestyle' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Smoking</label>
              <select
                value={formData.lifestyle.smoking}
                onChange={e => handleNestedChange('lifestyle', 'smoking', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Alcohol Consumption</label>
              <select
                value={formData.lifestyle.alcohol}
                onChange={e => handleNestedChange('lifestyle', 'alcohol', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Never">Never</option>
                <option value="Occasionally">Occasionally</option>
                <option value="Frequently">Frequently</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Travel Frequency</label>
              <select
                value={formData.lifestyle.travel_frequency}
                onChange={e => handleNestedChange('lifestyle', 'travel_frequency', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Online Shopping</label>
              <select
                value={formData.lifestyle.online_shopping_frequency}
                onChange={e => handleNestedChange('lifestyle', 'online_shopping_frequency', e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
