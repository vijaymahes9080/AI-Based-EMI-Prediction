from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class PersonalDetails(BaseModel):
    age: int = Field(..., ge=18, le=100, example=32)
    gender: str = Field(..., example="Male")  # Male, Female, Other
    occupation: str = Field(..., example="Software Engineer")
    employment_type: str = Field(..., example="Salaried") # Salaried, Self-Employed, Business, Unemployed
    marital_status: str = Field(..., example="Married") # Single, Married, Divorced
    number_of_dependents: int = Field(..., ge=0, le=10, example=2)

class IncomeDetails(BaseModel):
    monthly_salary: float = Field(..., ge=0, example=85000.0)
    additional_income: float = Field(0.0, ge=0, example=5000.0)
    annual_bonus: float = Field(0.0, ge=0, example=120000.0)
    business_income: float = Field(0.0, ge=0, example=0.0)

class ExpenseDetails(BaseModel):
    house_rent: float = Field(0.0, ge=0, example=20000.0)
    food_expenses: float = Field(0.0, ge=0, example=12000.0)
    transportation: float = Field(0.0, ge=0, example=4000.0)
    electricity_bill: float = Field(0.0, ge=0, example=2500.0)
    internet_bill: float = Field(0.0, ge=0, example=1000.0)
    insurance: float = Field(0.0, ge=0, example=3000.0)
    education: float = Field(0.0, ge=0, example=5000.0)
    medical_expenses: float = Field(0.0, ge=0, example=2000.0)
    entertainment: float = Field(0.0, ge=0, example=3500.0)
    shopping: float = Field(0.0, ge=0, example=6000.0)
    other_expenses: float = Field(0.0, ge=0, example=3000.0)

class LoanDetails(BaseModel):
    loan_type: str = Field("Home Loan", example="Personal Loan")
    loan_amount: float = Field(0.0, ge=0, example=500000.0)
    interest_rate: float = Field(10.5, ge=0, le=50, example=10.5)
    loan_tenure_months: int = Field(36, ge=6, le=360, example=36)
    existing_emi: float = Field(0.0, ge=0, example=5000.0)
    credit_card_emi: float = Field(0.0, ge=0, example=2000.0)
    personal_loan_emi: float = Field(0.0, ge=0, example=0.0)
    home_loan_emi: float = Field(0.0, ge=0, example=15000.0)
    vehicle_loan_emi: float = Field(0.0, ge=0, example=0.0)

class BankingDetails(BaseModel):
    credit_score: int = Field(750, ge=300, le=900, example=750)
    bank_balance: float = Field(150000.0, ge=0, example=150000.0)
    savings: float = Field(200000.0, ge=0, example=200000.0)
    investments: float = Field(300000.0, ge=0, example=300000.0)

class LifestyleDetails(BaseModel):
    smoking: str = Field("No", example="No") # Yes, No
    alcohol: str = Field("Occasionally", example="Occasionally") # Never, Frequently, Linearly, Occasionally
    travel_frequency: str = Field("Moderate", example="Moderate") # Low, Moderate, High
    online_shopping_frequency: str = Field("High", example="High") # Low, Moderate, High

class FinancialProfileInput(BaseModel):
    personal: PersonalDetails
    income: IncomeDetails
    expenses: ExpenseDetails
    loans: LoanDetails
    banking: BankingDetails
    lifestyle: LifestyleDetails

class FeatureImportanceItem(BaseModel):
    feature: str
    impact: float
    description: str
    direction: str  # positive, negative, neutral

class RecommendationItem(BaseModel):
    category: str
    severity: str # High, Medium, Low, Positive
    title: str
    description: str
    action_item: str

class FutureTrendItem(BaseModel):
    month: str
    predicted_spending: float
    predicted_savings: float
    confidence_upper: float
    confidence_lower: float

class PredictionResponse(BaseModel):
    predicted_monthly_emi: float
    recommended_max_emi: float
    monthly_savings_after_emi: float
    disposable_income: float
    debt_to_income_ratio: float
    financial_health_score: float # 0 to 100
    loan_approval_chance: float # 0 to 100%
    emi_default_risk: float # 0 to 100%
    budget_score: float # 0 to 100
    investment_capacity: float
    future_trends: List[FutureTrendItem]
    top_feature_impacts: List[FeatureImportanceItem]
    recommendations: List[RecommendationItem]
