from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_data() -> Dict[str, Any]:
    """Provide benchmark analytics data for visual charts."""
    return {
        "benchmark_expense_breakdown": [
            {"category": "House Rent", "percentage": 30.0, "amount": 25000},
            {"category": "Food Expenses", "percentage": 20.0, "amount": 16000},
            {"category": "Transportation", "percentage": 10.0, "amount": 8000},
            {"category": "Utilities & Bills", "percentage": 8.0, "amount": 6400},
            {"category": "Insurance & Health", "percentage": 8.0, "amount": 6400},
            {"category": "Shopping & Lifestyle", "percentage": 14.0, "amount": 11200},
            {"category": "Entertainment & Other", "percentage": 10.0, "amount": 8000}
        ],
        "credit_score_risk_curve": [
            {"credit_score": 550, "default_risk": 78.5, "approval_rate": 15.0},
            {"credit_score": 620, "default_risk": 52.0, "approval_rate": 35.0},
            {"credit_score": 680, "default_risk": 28.4, "approval_rate": 65.0},
            {"credit_score": 740, "default_risk": 12.1, "approval_rate": 88.0},
            {"credit_score": 800, "default_risk": 4.2, "approval_rate": 96.0},
            {"credit_score": 850, "default_risk": 1.5, "approval_rate": 99.0}
        ],
        "tenure_emi_comparison": [
            {"tenure_months": 12, "monthly_emi": 44424, "total_interest": 33088},
            {"tenure_months": 24, "monthly_emi": 23304, "total_interest": 59296},
            {"tenure_months": 36, "monthly_emi": 16254, "total_interest": 85144},
            {"tenure_months": 48, "monthly_emi": 12748, "total_interest": 111904},
            {"tenure_months": 60, "monthly_emi": 10664, "total_interest": 139840}
        ]
    }
