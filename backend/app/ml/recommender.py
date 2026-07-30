from typing import List, Dict, Any

class FinancialRecommenderEngine:
    def generate_recommendations(self, data: Dict[str, Any], predictions: Dict[str, Any]) -> List[Dict[str, Any]]:
        recs = []

        inc = data.get("income", {})
        exp = data.get("expenses", {})
        loan = data.get("loans", {})
        bank = data.get("banking", {})

        total_income = (
            inc.get("monthly_salary", 0.0) +
            inc.get("additional_income", 0.0) +
            (inc.get("annual_bonus", 0.0) / 12.0) +
            inc.get("business_income", 0.0)
        )

        dti = predictions.get("debt_to_income_ratio", 0.0)
        health_score = predictions.get("financial_health_score", 50.0)
        default_risk = predictions.get("emi_default_risk", 0.0)
        max_rec_emi = predictions.get("recommended_max_emi", 0.0)
        proposed_emi = predictions.get("predicted_monthly_emi", 0.0)

        c_score = bank.get("credit_score", 700)
        emergency_months = data.get("emergency_fund_months", 3.0)

        # 1. DTI & EMI Range Recommendation
        if dti > 0.45:
            recs.append({
                "category": "Debt Management",
                "severity": "High",
                "title": "High Debt-to-Income (DTI) Ratio Detected",
                "description": f"Your current debt obligations consume {round(dti*100, 1)}% of gross monthly income, exceeding the safe limit of 40%.",
                "action_item": f"Limit new monthly EMI to maximum ${max_rec_emi:,.0f} or consolidate high-interest credit card debt."
            })
        elif proposed_emi > max_rec_emi and max_rec_emi > 0:
            recs.append({
                "category": "EMI Limit",
                "severity": "Medium",
                "title": "Proposed EMI Exceeds Recommended Limit",
                "description": f"The requested loan EMI of ${proposed_emi:,.0f} is higher than your safe threshold of ${max_rec_emi:,.0f}.",
                "action_item": f"Increase loan tenure from {loan.get('loan_tenure_months', 36)} to {loan.get('loan_tenure_months', 36) + 12} months to reduce monthly installment."
            })
        else:
            recs.append({
                "category": "EMI Affordability",
                "severity": "Positive",
                "title": "Healthy EMI Capacity",
                "description": f"Your monthly EMI burden is well within safe thresholds (${max_rec_emi:,.0f} max recommended).",
                "action_item": "Maintain current repayment schedule without taking on additional unhedged liabilities."
            })

        # 2. Emergency Savings Recommendation
        liquid_savings = bank.get("bank_balance", 0.0) + bank.get("savings", 0.0)
        living_expenses = (
            exp.get("house_rent", 0.0) + exp.get("food_expenses", 0.0) +
            exp.get("transportation", 0.0) + exp.get("electricity_bill", 0.0) +
            exp.get("internet_bill", 0.0) + exp.get("insurance", 0.0) +
            exp.get("education", 0.0) + exp.get("medical_expenses", 0.0)
        )
        total_monthly_expenses = living_expenses + loan.get("existing_emi", 0.0)
        months_covered = liquid_savings / (total_monthly_expenses + 1e-5)

        if months_covered < 3.0:
            shortfall = (3.0 * total_monthly_expenses) - liquid_savings
            recs.append({
                "category": "Emergency Fund",
                "severity": "High",
                "title": "Insufficient Emergency Liquidity",
                "description": f"Your current bank balance and savings cover only {round(months_covered, 1)} months of living expenses (minimum 3-6 months recommended).",
                "action_item": f"Set aside ${round(shortfall / 6, -2):,.0f} per month over the next 6 months to reach a ${round(3.0 * total_monthly_expenses, -2):,.0f} safety cushion."
            })
        elif months_covered >= 6.0:
            recs.append({
                "category": "Emergency Fund",
                "severity": "Positive",
                "title": "Robust Safety Net",
                "description": f"Excellent reserve covering {round(months_covered, 1)} months of living expenses.",
                "action_item": "Surplus liquidity above 6 months can be deployed into higher-yielding growth investments."
            })

        # 3. Credit Score Optimization
        if c_score < 720:
            recs.append({
                "category": "Credit Score",
                "severity": "Medium",
                "title": "Credit Score Improvement Opportunity",
                "description": f"Your credit score of {c_score} is below prime rating (750+), raising interest rates by up to 2.5%.",
                "action_item": "Keep credit card utilization below 30%, automate bill payments, and avoid multiple hard credit inquiries."
            })

        # 4. Lifestyle & Discretionary Expense Optimization
        shopping = exp.get("shopping", 0.0)
        entertainment = exp.get("entertainment", 0.0)
        lifestyle_spend = shopping + entertainment
        if total_income > 0 and (lifestyle_spend / total_income) > 0.20:
            savings_potential = lifestyle_spend * 0.30
            recs.append({
                "category": "Expense Optimization",
                "severity": "Medium",
                "title": "High Discretionary Spending",
                "description": f"Shopping and entertainment account for {round((lifestyle_spend / total_income)*100, 1)}% of your monthly income.",
                "action_item": f"Trim non-essential lifestyle expenses by 30% to free up ${savings_potential:,.0f}/month for investments or loan pre-payments."
            })

        # 5. Investment Capacity Recommendation
        disposable = predictions.get("disposable_income", 0.0)
        if disposable > 10000:
            invest_target = disposable * 0.40
            recs.append({
                "category": "Investments",
                "severity": "Low",
                "title": "Uncapped Growth & Investment Potential",
                "description": f"You have ${disposable:,.0f} in monthly net disposable cash flow after all expenses and debt service.",
                "action_item": f"Consider allocating ${invest_target:,.0f}/month into low-cost Index Funds, SIPs, or high-yield dividend assets."
            })

        return recs
