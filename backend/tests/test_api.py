import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "operational" in response.json()["message"]

def test_dashboard_endpoint():
    response = client.get("/api/v1/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "benchmark_expense_breakdown" in data
    assert "credit_score_risk_curve" in data

def test_model_info_endpoint():
    response = client.get("/api/v1/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "active_regressor" in data
    assert "active_classifier" in data

def test_predict_endpoint():
    sample_payload = {
        "personal": {
            "age": 30,
            "gender": "Male",
            "occupation": "Software Engineer",
            "employment_type": "Salaried",
            "marital_status": "Single",
            "number_of_dependents": 0
        },
        "income": {
            "monthly_salary": 85000.0,
            "additional_income": 5000.0,
            "annual_bonus": 120000.0,
            "business_income": 0.0
        },
        "expenses": {
            "house_rent": 20000.0,
            "food_expenses": 12000.0,
            "transportation": 4000.0,
            "electricity_bill": 2500.0,
            "internet_bill": 1000.0,
            "insurance": 3000.0,
            "education": 0.0,
            "medical_expenses": 2000.0,
            "entertainment": 3500.0,
            "shopping": 6000.0,
            "other_expenses": 3000.0
        },
        "loans": {
            "loan_type": "Personal Loan",
            "loan_amount": 500000.0,
            "interest_rate": 10.5,
            "loan_tenure_months": 36,
            "existing_emi": 5000.0,
            "credit_card_emi": 2000.0,
            "personal_loan_emi": 0.0,
            "home_loan_emi": 15000.0,
            "vehicle_loan_emi": 0.0
        },
        "banking": {
            "credit_score": 750,
            "bank_balance": 150000.0,
            "savings": 200000.0,
            "investments": 300000.0
        },
        "lifestyle": {
            "smoking": "No",
            "alcohol": "Occasionally",
            "travel_frequency": "Moderate",
            "online_shopping_frequency": "High"
        }
    }

    response = client.post("/api/v1/predict", json=sample_payload)
    assert response.status_code == 200
    data = response.json()
    assert "financial_health_score" in data
    assert "emi_default_risk" in data
    assert "top_feature_impacts" in data
    assert "recommendations" in data
