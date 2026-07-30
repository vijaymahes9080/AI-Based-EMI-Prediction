import numpy as np
import pandas as pd
from typing import Tuple, Dict, Any, List
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
import joblib

FEATURE_COLUMNS_NUMERIC = [
    "age", "number_of_dependents",
    "monthly_salary", "additional_income", "annual_bonus", "business_income",
    "total_monthly_income", "house_rent", "food_expenses", "transportation",
    "electricity_bill", "internet_bill", "insurance", "education",
    "medical_expenses", "entertainment", "shopping", "other_expenses",
    "total_living_expenses", "loan_amount", "interest_rate", "loan_tenure_months",
    "proposed_emi", "existing_home_emi", "existing_personal_emi",
    "existing_vehicle_emi", "existing_cc_emi", "total_existing_emi",
    "credit_score", "bank_balance", "savings", "investments",
    # Engineered features
    "debt_to_income_ratio", "savings_ratio", "expense_ratio",
    "disposable_income", "total_emi", "financial_stability_index",
    "monthly_cash_flow", "emergency_fund_months"
]

FEATURE_COLUMNS_CATEGORICAL = [
    "gender", "occupation", "employment_type", "marital_status",
    "loan_type", "smoking", "alcohol", "travel_frequency", "online_shopping_frequency"
]

def compute_engineered_features_dict(data: Dict[str, Any]) -> Dict[str, Any]:
    """Helper to convert nested dictionary structure to flat dictionary with engineered features."""
    p = data.get("personal", {})
    inc = data.get("income", {})
    exp = data.get("expenses", {})
    loan = data.get("loans", {})
    bank = data.get("banking", {})
    life = data.get("lifestyle", {})

    total_monthly_income = (
        inc.get("monthly_salary", 0.0) +
        inc.get("additional_income", 0.0) +
        (inc.get("annual_bonus", 0.0) / 12.0) +
        inc.get("business_income", 0.0)
    )

    total_living_expenses = (
        exp.get("house_rent", 0.0) +
        exp.get("food_expenses", 0.0) +
        exp.get("transportation", 0.0) +
        exp.get("electricity_bill", 0.0) +
        exp.get("internet_bill", 0.0) +
        exp.get("insurance", 0.0) +
        exp.get("education", 0.0) +
        exp.get("medical_expenses", 0.0) +
        exp.get("entertainment", 0.0) +
        exp.get("shopping", 0.0) +
        exp.get("other_expenses", 0.0)
    )

    # Proposed EMI calculation using standard loan formula if not present
    loan_amt = loan.get("loan_amount", 0.0)
    rate = loan.get("interest_rate", 10.5)
    tenure = loan.get("loan_tenure_months", 36)
    if loan_amt > 0 and tenure > 0:
        r = rate / (12 * 100)
        proposed_emi = loan_amt * r * ((1 + r)**tenure) / (((1 + r)**tenure) - 1)
    else:
        proposed_emi = 0.0

    total_existing_emi = (
        loan.get("existing_emi", 0.0) +
        loan.get("credit_card_emi", 0.0) +
        loan.get("personal_loan_emi", 0.0) +
        loan.get("home_loan_emi", 0.0) +
        loan.get("vehicle_loan_emi", 0.0)
    )

    total_emi = total_existing_emi + proposed_emi
    dti_ratio = total_emi / (total_monthly_income + 1e-5)
    disposable_income = total_monthly_income - total_living_expenses - total_existing_emi
    monthly_cash_flow = total_monthly_income - total_living_expenses - total_emi
    savings_ratio = monthly_cash_flow / (total_monthly_income + 1e-5)
    expense_ratio = total_living_expenses / (total_monthly_income + 1e-5)

    liquid_assets = bank.get("bank_balance", 0.0) + bank.get("savings", 0.0)
    emergency_fund_months = liquid_assets / (total_living_expenses + total_existing_emi + 1e-5)

    c_score = bank.get("credit_score", 700)
    financial_stability_index = (
        (c_score / 850.0) * 0.4 +
        (min(emergency_fund_months, 12.0) / 12.0) * 0.3 +
        (1.0 - min(dti_ratio, 1.0)) * 0.3
    ) * 100.0

    flat = {
        "age": p.get("age", 30),
        "gender": p.get("gender", "Male"),
        "occupation": p.get("occupation", "Software Engineer"),
        "employment_type": p.get("employment_type", "Salaried"),
        "marital_status": p.get("marital_status", "Single"),
        "number_of_dependents": p.get("number_of_dependents", 0),

        "monthly_salary": inc.get("monthly_salary", 0.0),
        "additional_income": inc.get("additional_income", 0.0),
        "annual_bonus": inc.get("annual_bonus", 0.0),
        "business_income": inc.get("business_income", 0.0),
        "total_monthly_income": total_monthly_income,

        "house_rent": exp.get("house_rent", 0.0),
        "food_expenses": exp.get("food_expenses", 0.0),
        "transportation": exp.get("transportation", 0.0),
        "electricity_bill": exp.get("electricity_bill", 0.0),
        "internet_bill": exp.get("internet_bill", 0.0),
        "insurance": exp.get("insurance", 0.0),
        "education": exp.get("education", 0.0),
        "medical_expenses": exp.get("medical_expenses", 0.0),
        "entertainment": exp.get("entertainment", 0.0),
        "shopping": exp.get("shopping", 0.0),
        "other_expenses": exp.get("other_expenses", 0.0),
        "total_living_expenses": total_living_expenses,

        "loan_type": loan.get("loan_type", "Home Loan"),
        "loan_amount": loan_amt,
        "interest_rate": rate,
        "loan_tenure_months": tenure,
        "proposed_emi": proposed_emi,
        "existing_home_emi": loan.get("home_loan_emi", 0.0),
        "existing_personal_emi": loan.get("personal_loan_emi", 0.0),
        "existing_vehicle_emi": loan.get("vehicle_loan_emi", 0.0),
        "existing_cc_emi": loan.get("credit_card_emi", 0.0),
        "total_existing_emi": total_existing_emi,

        "credit_score": c_score,
        "bank_balance": bank.get("bank_balance", 0.0),
        "savings": bank.get("savings", 0.0),
        "investments": bank.get("investments", 0.0),

        "smoking": life.get("smoking", "No"),
        "alcohol": life.get("alcohol", "Occasionally"),
        "travel_frequency": life.get("travel_frequency", "Moderate"),
        "online_shopping_frequency": life.get("online_shopping_frequency", "Moderate"),

        # Engineered
        "debt_to_income_ratio": dti_ratio,
        "savings_ratio": savings_ratio,
        "expense_ratio": expense_ratio,
        "disposable_income": disposable_income,
        "total_emi": total_emi,
        "financial_stability_index": financial_stability_index,
        "monthly_cash_flow": monthly_cash_flow,
        "emergency_fund_months": emergency_fund_months
    }
    return flat

class FinancialDataPreprocessor:
    def __init__(self):
        numeric_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='median')),
            ('scaler', StandardScaler())
        ])
        categorical_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='most_frequent')),
            ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
        ])
        self.column_transformer = ColumnTransformer(
            transformers=[
                ('num', numeric_transformer, FEATURE_COLUMNS_NUMERIC),
                ('cat', categorical_transformer, FEATURE_COLUMNS_CATEGORICAL)
            ]
        )
        self.is_fitted = False
        self.feature_names = []

    def fit(self, df: pd.DataFrame):
        df_engineered = self.add_engineered_columns_to_df(df.copy())
        self.column_transformer.fit(df_engineered)
        self.is_fitted = True

        # Extract encoded feature names
        num_features = FEATURE_COLUMNS_NUMERIC
        cat_encoder = self.column_transformer.named_transformers_['cat'].named_steps['encoder']
        cat_features = list(cat_encoder.get_feature_names_out(FEATURE_COLUMNS_CATEGORICAL))
        self.feature_names = num_features + cat_features
        return self

    def transform(self, df: pd.DataFrame) -> np.ndarray:
        if not self.is_fitted:
            raise RuntimeError("Preprocessor must be fitted before calling transform.")
        df_engineered = self.add_engineered_columns_to_df(df.copy())
        return self.column_transformer.transform(df_engineered)

    def fit_transform(self, df: pd.DataFrame) -> np.ndarray:
        self.fit(df)
        return self.transform(df)

    def add_engineered_columns_to_df(self, df: pd.DataFrame) -> pd.DataFrame:
        df_copy = df.copy()
        if "total_monthly_income" not in df_copy.columns:
            df_copy["total_monthly_income"] = (
                df_copy["monthly_salary"] + df_copy["additional_income"] +
                (df_copy["annual_bonus"] / 12.0) + df_copy["business_income"]
            )
        if "total_living_expenses" not in df_copy.columns:
            exp_cols = ["house_rent", "food_expenses", "transportation", "electricity_bill",
                        "internet_bill", "insurance", "education", "medical_expenses",
                        "entertainment", "shopping", "other_expenses"]
            df_copy["total_living_expenses"] = df_copy[exp_cols].sum(axis=1)

        if "total_existing_emi" not in df_copy.columns:
            emi_cols = ["existing_home_emi", "existing_personal_emi", "existing_vehicle_emi", "existing_cc_emi"]
            df_copy["total_existing_emi"] = df_copy[emi_cols].sum(axis=1)

        if "proposed_emi" not in df_copy.columns:
            r = df_copy["interest_rate"] / (12 * 100)
            n = df_copy["loan_tenure_months"]
            amt = df_copy["loan_amount"]
            df_copy["proposed_emi"] = np.where(
                (amt > 0) & (n > 0),
                amt * r * ((1 + r)**n) / (((1 + r)**n) - 1),
                0.0
            )

        df_copy["total_emi"] = df_copy["total_existing_emi"] + df_copy["proposed_emi"]
        df_copy["debt_to_income_ratio"] = df_copy["total_emi"] / (df_copy["total_monthly_income"] + 1e-5)
        df_copy["disposable_income"] = df_copy["total_monthly_income"] - df_copy["total_living_expenses"] - df_copy["total_existing_emi"]
        df_copy["monthly_cash_flow"] = df_copy["total_monthly_income"] - df_copy["total_living_expenses"] - df_copy["total_emi"]
        df_copy["savings_ratio"] = df_copy["monthly_cash_flow"] / (df_copy["total_monthly_income"] + 1e-5)
        df_copy["expense_ratio"] = df_copy["total_living_expenses"] / (df_copy["total_monthly_income"] + 1e-5)

        liquid_assets = df_copy["bank_balance"] + df_copy["savings"]
        df_copy["emergency_fund_months"] = liquid_assets / (df_copy["total_living_expenses"] + df_copy["total_existing_emi"] + 1e-5)

        df_copy["financial_stability_index"] = (
            (df_copy["credit_score"] / 850.0) * 0.4 +
            (np.clip(df_copy["emergency_fund_months"], 0, 12) / 12.0) * 0.3 +
            (1.0 - np.clip(df_copy["debt_to_income_ratio"], 0, 1.0)) * 0.3
        ) * 100.0
        return df_copy
