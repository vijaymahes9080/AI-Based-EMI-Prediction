import os
import joblib
from fastapi import APIRouter, HTTPException
from typing import Dict, Any

from app.ml.trainer import ModelTrainer

router = APIRouter()

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "models")

@router.post("/train")
def train_models():
    """Trigger complete ML training pipeline."""
    try:
        trainer = ModelTrainer()
        summary = trainer.train_all()
        return {"status": "success", "message": "ML training complete", "metrics": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")

@router.get("/metrics")
def get_metrics() -> Dict[str, Any]:
    """Retrieve detailed evaluation metrics for all regression and classification models."""
    metrics_path = os.path.join(MODELS_DIR, "metrics_summary.joblib")
    if not os.path.exists(metrics_path):
        trainer = ModelTrainer()
        return trainer.train_all()
    summary = joblib.load(metrics_path)
    return summary

@router.get("/model-info")
def get_model_info() -> Dict[str, Any]:
    """Retrieve active model architecture metadata."""
    reg_path = os.path.join(MODELS_DIR, "best_regressor.joblib")
    cls_path = os.path.join(MODELS_DIR, "best_classifier.joblib")

    reg_name = "XGBoost Regressor"
    cls_name = "XGBoost Classifier"

    if os.path.exists(reg_path):
        reg_dict = joblib.load(reg_path)
        reg_name = reg_dict.get("name", reg_name)

    if os.path.exists(cls_path):
        cls_dict = joblib.load(cls_path)
        cls_name = cls_dict.get("name", cls_name)

    return {
        "active_regressor": reg_name,
        "active_classifier": cls_name,
        "frameworks": ["Scikit-Learn", "XGBoost", "LightGBM", "CatBoost"],
        "pipeline_version": "1.0.0",
        "cross_validation_folds": 5,
        "explainable_ai": "SHAP (SHapley Additive exPlanations) & Feature Contribution Matrix"
    }

@router.get("/feature-importance")
def get_feature_importance():
    """Retrieve global feature importance rankings."""
    prep_path = os.path.join(MODELS_DIR, "preprocessor.joblib")
    reg_path = os.path.join(MODELS_DIR, "best_regressor.joblib")

    if not (os.path.exists(prep_path) and os.path.exists(reg_path)):
        trainer = ModelTrainer()
        trainer.train_all()

    preprocessor = joblib.load(prep_path)
    reg_dict = joblib.load(reg_path)
    model = reg_dict["model"]

    feature_names = preprocessor.feature_names
    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
    elif hasattr(model, "coef_"):
        coef = model.coef_
        importances = abs(coef[0]) if coef.ndim > 1 else abs(coef)
    else:
        importances = [1.0 / len(feature_names)] * len(feature_names)

    items = []
    for name, imp in zip(feature_names, importances):
        clean_name = name.replace("num__", "").replace("cat__", "").replace("_", " ").title()
        items.append({"feature": clean_name, "importance": round(float(imp) * 100, 2)})

    items.sort(key=lambda x: x["importance"], reverse=True)
    return {"top_features": items[:15]}
