import os
import numpy as np
import pandas as pd

def generate_synthetic_dataset(num_samples: int = 2500, random_seed: int = 42) -> pd.DataFrame:
    np.random.seed(random_seed)
    
    ages = np.random.randint(21, 65, size=num_samples)
    genders = np.random.choice(["Male", "Female", "Other"], size=num_samples, p=[0.52, 0.46, 0.02])
    occupations = np.random.choice(
        ["Software Engineer", "Doctor", "Teacher", "Accountant", "Business Owner", "Manager", "Sales Executive", "Analyst", "Other"],
        size=num_samples
    )
    employment_types = np.random.choice(["Salaried", "Self-Employed", "Business", "Unemployed"], size=num_samples, p=[0.65, 0.20, 0.12, 0.03])
    marital_statuses = np.random.choice(["Single", "Married", "Divorced"], size=num_samples, p=[0.40, 0.52, 0.08])
    dependents = np.random.choice([0, 1, 2, 3, 4], size=num_samples, p=[0.35, 0.25, 0.25, 0.10, 0.05])
    
    # Income metrics
    monthly_salaries = np.round(np.random.lognormal(mean=10.8, sigma=0.5, size=num_samples), -2) # ~25k to ~250k
    additional_incomes = np.where(np.random.rand(num_samples) > 0.6, np.round(np.random.uniform(2000, 25000, num_samples), -2), 0)
    annual_bonuses = np.where(np.random.rand(num_samples) > 0.5, np.round(monthly_salaries * np.random.uniform(0.5, 3.0, num_samples), -3), 0)
    business_incomes = np.where(employment_types == "Business", np.round(monthly_salaries * np.random.uniform(0.5, 2.0, num_samples), -2), 0)

    total_monthly_income = monthly_salaries + additional_incomes + (annual_bonuses / 12.0) + business_incomes
    
    # Expense metrics
    rent_prop = np.random.uniform(0.10, 0.35, size=num_samples)
    house_rents = np.round(total_monthly_income * rent_prop, -2)
    food_expenses = np.round(np.random.uniform(4000, 18000, num_samples) + dependents * 2000, -2)
    transportation = np.round(np.random.uniform(2000, 10000, num_samples), -2)
    electricity = np.round(np.random.uniform(1000, 6000, num_samples), -2)
    internet = np.round(np.random.uniform(500, 2500, num_samples), -2)
    insurance = np.round(np.random.uniform(1000, 12000, num_samples), -2)
    education = np.where(dependents > 0, np.round(np.random.uniform(3000, 20000, num_samples), -2), 0)
    medical = np.round(np.random.uniform(1000, 15000, num_samples), -2)
    entertainment = np.round(np.random.uniform(1000, 12000, num_samples), -2)
    shopping = np.round(np.random.uniform(2000, 25000, num_samples), -2)
    other_expenses = np.round(np.random.uniform(1000, 8000, num_samples), -2)

    total_living_expenses = (
        house_rents + food_expenses + transportation + electricity + internet +
        insurance + education + medical + entertainment + shopping + other_expenses
    )

    # Loan Details
    loan_types = np.random.choice(["Personal Loan", "Home Loan", "Vehicle Loan", "Education Loan", "Business Loan"], size=num_samples)
    loan_amounts = np.round(total_monthly_income * np.random.uniform(5, 60, num_samples), -3)
    interest_rates = np.round(np.random.uniform(7.5, 18.0, num_samples), 1)
    loan_tenures = np.random.choice([12, 24, 36, 48, 60, 120, 180, 240, 360], size=num_samples)
    
    # Calculate target monthly EMI for proposed loan
    r = interest_rates / (12 * 100)
    proposed_emis = np.round(loan_amounts * r * ((1 + r)**loan_tenures) / (((1 + r)**loan_tenures) - 1), -1)

    existing_home_emis = np.where(np.random.rand(num_samples) > 0.7, np.round(total_monthly_income * np.random.uniform(0.15, 0.35, num_samples), -2), 0)
    existing_personal_emis = np.where(np.random.rand(num_samples) > 0.75, np.round(total_monthly_income * np.random.uniform(0.05, 0.20, num_samples), -2), 0)
    existing_vehicle_emis = np.where(np.random.rand(num_samples) > 0.8, np.round(total_monthly_income * np.random.uniform(0.05, 0.15, num_samples), -2), 0)
    existing_cc_emis = np.where(np.random.rand(num_samples) > 0.6, np.round(np.random.uniform(1000, 15000, num_samples), -2), 0)

    total_existing_emis = existing_home_emis + existing_personal_emis + existing_vehicle_emis + existing_cc_emis

    # Banking & Credit Score
    credit_scores = np.random.randint(300, 880, size=num_samples)
    bank_balances = np.round(total_monthly_income * np.random.uniform(0.5, 10.0, num_samples), -2)
    savings = np.round(total_monthly_income * np.random.uniform(1.0, 20.0, num_samples), -2)
    investments = np.round(total_monthly_income * np.random.uniform(0.0, 30.0, num_samples), -2)

    # Lifestyle
    smokings = np.random.choice(["Yes", "No"], size=num_samples, p=[0.2, 0.8])
    alcohols = np.random.choice(["Never", "Occasionally", "Frequently"], size=num_samples, p=[0.5, 0.4, 0.1])
    travel_freqs = np.random.choice(["Low", "Moderate", "High"], size=num_samples, p=[0.5, 0.35, 0.15])
    shopping_freqs = np.random.choice(["Low", "Moderate", "High"], size=num_samples, p=[0.3, 0.5, 0.2])

    # Engineered Ratios & Ground Truth Target Calculations
    total_obligations = total_existing_emis + proposed_emis
    dti = total_obligations / (total_monthly_income + 1e-5)
    net_monthly_cashflow = total_monthly_income - total_living_expenses - total_existing_emis
    emergency_fund_months = (bank_balances + savings) / (total_living_expenses + total_existing_emis + 1e-5)
    
    # Ground Truth: Financial Health Score (0 - 100)
    # Higher savings ratio, higher credit score, higher emergency fund, lower DTI => higher health score
    savings_ratio = np.clip(net_monthly_cashflow / (total_monthly_income + 1e-5), -0.5, 0.8)
    health_score_raw = (
        (credit_scores / 850.0) * 35.0 +
        (1.0 - np.clip(dti, 0, 1.2)) * 30.0 +
        (np.clip(savings_ratio, 0, 0.5) / 0.5) * 20.0 +
        (np.clip(emergency_fund_months, 0, 12) / 12.0) * 15.0
    )
    # Add minor noise
    financial_health_score = np.clip(health_score_raw + np.random.normal(0, 3, num_samples), 10, 99).round(1)

    # Ground Truth: EMI Default Risk (Probability 0.0 to 1.0)
    # Higher DTI, lower credit score, low emergency fund, unemployed/self-employed risk => higher default probability
    log_odds = (
        (dti * 4.5) -
        (credit_scores - 600) / 75.0 -
        (emergency_fund_months / 4.0) +
        np.where(employment_types == "Unemployed", 1.5, 0) +
        np.where(smokings == "Yes", 0.3, 0) -
        (savings_ratio * 2.0) +
        np.random.normal(0, 0.4, num_samples)
    )
    default_probability = 1.0 / (1.0 + np.exp(-log_odds))
    emi_default_flag = (default_probability > 0.45).astype(int)

    # Ground Truth: Monthly EMI Affordability Capacity
    # Max safe EMI is ~ 40% to 50% of disposable income considering existing obligations
    recommended_max_emi = np.maximum(0, np.round((total_monthly_income * 0.45) - total_existing_emis, -1))

    df = pd.DataFrame({
        "age": ages,
        "gender": genders,
        "occupation": occupations,
        "employment_type": employment_types,
        "marital_status": marital_statuses,
        "number_of_dependents": dependents,
        
        "monthly_salary": monthly_salaries,
        "additional_income": additional_incomes,
        "annual_bonus": annual_bonuses,
        "business_income": business_incomes,
        "total_monthly_income": total_monthly_income,

        "house_rent": house_rents,
        "food_expenses": food_expenses,
        "transportation": transportation,
        "electricity_bill": electricity,
        "internet_bill": internet,
        "insurance": insurance,
        "education": education,
        "medical_expenses": medical,
        "entertainment": entertainment,
        "shopping": shopping,
        "other_expenses": other_expenses,
        "total_living_expenses": total_living_expenses,

        "loan_type": loan_types,
        "loan_amount": loan_amounts,
        "interest_rate": interest_rates,
        "loan_tenure_months": loan_tenures,
        "proposed_emi": proposed_emis,
        "existing_home_emi": existing_home_emis,
        "existing_personal_emi": existing_personal_emis,
        "existing_vehicle_emi": existing_vehicle_emis,
        "existing_cc_emi": existing_cc_emis,
        "total_existing_emi": total_existing_emis,

        "credit_score": credit_scores,
        "bank_balance": bank_balances,
        "savings": savings,
        "investments": investments,

        "smoking": smokings,
        "alcohol": alcohols,
        "travel_frequency": travel_freqs,
        "online_shopping_frequency": shopping_freqs,

        # Engineered targets & metrics
        "debt_to_income_ratio": np.round(dti, 4),
        "emergency_fund_months": np.round(emergency_fund_months, 2),
        "disposable_income": np.round(net_monthly_cashflow, 2),
        "recommended_max_emi": recommended_max_emi,
        "financial_health_score": financial_health_score,
        "emi_default_risk_prob": np.round(default_probability, 4),
        "emi_default_flag": emi_default_flag
    })

    return df

if __name__ == "__main__":
    out_dir = os.path.join(os.path.dirname(__file__), "..", "..", "data")
    os.makedirs(out_dir, exist_ok=True)
    df = generate_synthetic_dataset(num_samples=2500)
    out_path = os.path.join(out_dir, "financial_dataset.csv")
    df.to_csv(out_path, index=False)
    print(f"Generated synthetic dataset with shape {df.shape} at {out_path}")
