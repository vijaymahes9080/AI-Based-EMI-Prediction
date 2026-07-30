export interface PersonalDetails {
  age: number;
  gender: string;
  occupation: string;
  employment_type: string;
  marital_status: string;
  number_of_dependents: number;
}

export interface IncomeDetails {
  monthly_salary: number;
  additional_income: number;
  annual_bonus: number;
  business_income: number;
}

export interface ExpenseDetails {
  house_rent: number;
  food_expenses: number;
  transportation: number;
  electricity_bill: number;
  internet_bill: number;
  insurance: number;
  education: number;
  medical_expenses: number;
  entertainment: number;
  shopping: number;
  other_expenses: number;
}

export interface LoanDetails {
  loan_type: string;
  loan_amount: number;
  interest_rate: number;
  loan_tenure_months: number;
  existing_emi: number;
  credit_card_emi: number;
  personal_loan_emi: number;
  home_loan_emi: number;
  vehicle_loan_emi: number;
}

export interface BankingDetails {
  credit_score: number;
  bank_balance: number;
  savings: number;
  investments: number;
}

export interface LifestyleDetails {
  smoking: string;
  alcohol: string;
  travel_frequency: string;
  online_shopping_frequency: string;
}

export interface FinancialProfileInput {
  personal: PersonalDetails;
  income: IncomeDetails;
  expenses: ExpenseDetails;
  loans: LoanDetails;
  banking: BankingDetails;
  lifestyle: LifestyleDetails;
}

export interface FeatureImportanceItem {
  feature: string;
  impact: number;
  description: string;
  direction: 'positive' | 'negative' | 'neutral';
}

export interface RecommendationItem {
  category: string;
  severity: 'High' | 'Medium' | 'Low' | 'Positive';
  title: string;
  description: string;
  action_item: string;
}

export interface FutureTrendItem {
  month: string;
  predicted_spending: number;
  predicted_savings: number;
  confidence_upper: number;
  confidence_lower: number;
}

export interface PredictionResponse {
  predicted_monthly_emi: number;
  recommended_max_emi: number;
  monthly_savings_after_emi: number;
  disposable_income: number;
  debt_to_income_ratio: number;
  financial_health_score: number;
  loan_approval_chance: number;
  emi_default_risk: number;
  budget_score: number;
  investment_capacity: number;
  future_trends: FutureTrendItem[];
  top_feature_impacts: FeatureImportanceItem[];
  recommendations: RecommendationItem[];
}

export interface DashboardAnalytics {
  benchmark_expense_breakdown: { category: string; percentage: number; amount: number }[];
  credit_score_risk_curve: { credit_score: number; default_risk: number; approval_rate: number }[];
  tenure_emi_comparison: { tenure_months: number; monthly_emi: number; total_interest: number }[];
}

export interface ModelMetricsSummary {
  best_regressor: string;
  best_classifier: string;
  regression_metrics: Record<string, { cv_r2_mean: number; mae: number; rmse: number; r2_score: number; mape: number }>;
  classification_metrics: Record<string, { cv_f1_mean: number; accuracy: number; precision: number; recall: number; f1_score: number; roc_auc: number }>;
  total_samples: number;
  features_count: number;
}
