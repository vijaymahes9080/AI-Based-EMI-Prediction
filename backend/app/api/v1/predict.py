import os
import joblib
import pandas as pd
import numpy as np
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import FinancialProfile, Prediction, Recommendation
from app.schemas.financial import FinancialProfileInput, PredictionResponse, FutureTrendItem, FeatureImportanceItem, RecommendationItem
from app.ml.preprocessor import compute_engineered_features_dict
from app.ml.explainer import ExplainableAIEngine
from app.ml.recommender import FinancialRecommenderEngine

router = APIRouter()

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "models")

def load_ml_components():
    preprocessor_path = os.path.join(MODELS_DIR, "preprocessor.joblib")
    regressor_path = os.path.join(MODELS_DIR, "best_regressor.joblib")
    classifier_path = os.path.join(MODELS_DIR, "best_classifier.joblib")

    if not (os.path.exists(preprocessor_path) and os.path.exists(regressor_path) and os.path.exists(classifier_path)):
        # Trigger auto-training if missing
        from app.ml.trainer import ModelTrainer
        trainer = ModelTrainer()
        trainer.train_all()

    preprocessor = joblib.load(preprocessor_path)
    reg_dict = joblib.load(regressor_path)
    cls_dict = joblib.load(classifier_path)

    return preprocessor, reg_dict["model"], cls_dict["model"]

@router.post("/predict", response_model=PredictionResponse)
def predict_financial_health(payload: FinancialProfileInput, db: Session = Depends(get_db)):
    try:
        data_dict = payload.model_dump()
        flat_dict = compute_engineered_features_dict(data_dict)
        input_df = pd.DataFrame([flat_dict])

        # Load models
        preprocessor, regressor, classifier = load_ml_components()

        # Transform features
        X_trans = preprocessor.transform(input_df)

        # Regressor prediction: Financial Health Score (0-100)
        raw_health_pred = float(regressor.predict(X_trans)[0])
        financial_health_score = round(max(10.0, min(99.0, raw_health_pred)), 1)

        # Classifier prediction: EMI Default Risk
        if hasattr(classifier, "predict_proba"):
            default_prob = float(classifier.predict_proba(X_trans)[0][1])
        else:
            default_prob = float(classifier.predict(X_trans)[0])
        emi_default_risk = round(default_prob * 100.0, 1)

        # Approval probability inversely related to default risk & DTI
        dti = flat_dict["debt_to_income_ratio"]
        c_score = flat_dict["credit_score"]

        loan_approval_chance = round(max(5.0, min(98.0, (100.0 - emi_default_risk) * (c_score / 750.0) * (1.0 - min(dti, 0.7)))), 1)

        # EMI metrics
        predicted_monthly_emi = round(flat_dict["proposed_emi"], 2)
        total_income = flat_dict["total_monthly_income"]

        recommended_max_emi = round(max(0.0, (total_income * 0.42) - flat_dict["total_existing_emi"]), 2)
        disposable_income = round(flat_dict["disposable_income"], 2)
        monthly_savings = round(flat_dict["monthly_cash_flow"], 2)
        budget_score = round(max(10.0, min(100.0, (flat_dict["savings_ratio"] + 0.2) * 120.0)), 1)
        investment_capacity = round(max(0.0, disposable_income * 0.35), 2)

        # Future 3, 6, 12 Month Spending & Savings Trends
        months_label = ["3 Months", "6 Months", "12 Months"]
        inflation_rates = [1.015, 1.032, 1.055]
        future_trends = []
        base_living = flat_dict["total_living_expenses"]

        for month_name, inf in zip(months_label, inflation_rates):
            proj_spending = round(base_living * inf + (predicted_monthly_emi * (1 if month_name != "3 Months" else 0.8)), 2)
            proj_savings = round(max(0.0, total_income * inf - proj_spending), 2)
            future_trends.append(FutureTrendItem(
                month=month_name,
                predicted_spending=proj_spending,
                predicted_savings=proj_savings,
                confidence_upper=round(proj_spending * 1.08, 2),
                confidence_lower=round(proj_spending * 0.92, 2)
            ))

        # Explainable AI Local Feature Attribution
        explainer = ExplainableAIEngine(preprocessor, regressor, preprocessor.feature_names)
        raw_impacts = explainer.get_local_explanation(input_df, top_k=8)
        top_impacts = [FeatureImportanceItem(**item) for item in raw_impacts]

        # Recommendations Engine
        prediction_dict = {
            "debt_to_income_ratio": dti,
            "financial_health_score": financial_health_score,
            "emi_default_risk": emi_default_risk,
            "recommended_max_emi": recommended_max_emi,
            "predicted_monthly_emi": predicted_monthly_emi,
            "disposable_income": disposable_income
        }
        recommender = FinancialRecommenderEngine()
        raw_recs = recommender.generate_recommendations(data_dict, prediction_dict)
        recommendations = [RecommendationItem(**item) for item in raw_recs]

        # Save to DB
        profile_record = FinancialProfile(profile_data=data_dict)
        db.add(profile_record)
        db.commit()
        db.refresh(profile_record)

        pred_record = Prediction(
            profile_id=profile_record.id,
            predicted_monthly_emi=predicted_monthly_emi,
            recommended_max_emi=recommended_max_emi,
            monthly_savings_after_emi=monthly_savings,
            disposable_income=disposable_income,
            debt_to_income_ratio=round(dti, 4),
            financial_health_score=financial_health_score,
            loan_approval_chance=loan_approval_chance,
            emi_default_risk=emi_default_risk,
            budget_score=budget_score,
            investment_capacity=investment_capacity,
            future_trends_json=[item.model_dump() for item in future_trends],
            feature_impacts_json=[item.model_dump() for item in top_impacts]
        )
        db.add(pred_record)
        db.commit()
        db.refresh(pred_record)

        for rec in recommendations:
            rec_db = Recommendation(
                prediction_id=pred_record.id,
                category=rec.category,
                severity=rec.severity,
                title=rec.title,
                description=rec.description,
                action_item=rec.action_item
            )
            db.add(rec_db)
        db.commit()

        return PredictionResponse(
            predicted_monthly_emi=predicted_monthly_emi,
            recommended_max_emi=recommended_max_emi,
            monthly_savings_after_emi=monthly_savings,
            disposable_income=disposable_income,
            debt_to_income_ratio=round(dti, 4),
            financial_health_score=financial_health_score,
            loan_approval_chance=loan_approval_chance,
            emi_default_risk=emi_default_risk,
            budget_score=budget_score,
            investment_capacity=investment_capacity,
            future_trends=future_trends,
            top_feature_impacts=top_impacts,
            recommendations=recommendations
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
