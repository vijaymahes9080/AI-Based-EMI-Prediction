import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple

from sklearn.model_selection import KFold, StratifiedKFold, cross_val_score
from sklearn.metrics import (
    mean_absolute_error, mean_squared_error, r2_score, mean_absolute_percentage_error,
    accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
)

# Regression Models
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, ExtraTreesRegressor
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor
from catboost import CatBoostRegressor

# Classification Models
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from catboost import CatBoostClassifier

from app.ml.preprocessor import FinancialDataPreprocessor
from app.ml.data_generator import generate_synthetic_dataset

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "models")
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")

class ModelTrainer:
    def __init__(self):
        os.makedirs(MODELS_DIR, exist_ok=True)
        os.makedirs(DATA_DIR, exist_ok=True)
        self.preprocessor = FinancialDataPreprocessor()
        self.best_regressor = None
        self.best_regressor_name = ""
        self.best_classifier = None
        self.best_classifier_name = ""
        self.metrics_summary = {}

    def get_regression_models(self) -> Dict[str, Any]:
        return {
            "Linear Regression": LinearRegression(),
            "Random Forest": RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1),
            "Gradient Boosting": GradientBoostingRegressor(n_estimators=100, random_state=42),
            "Extra Trees": ExtraTreesRegressor(n_estimators=100, random_state=42, n_jobs=-1),
            "XGBoost": XGBRegressor(n_estimators=100, learning_rate=0.05, max_depth=5, random_state=42, n_jobs=-1),
            "LightGBM": LGBMRegressor(n_estimators=100, learning_rate=0.05, max_depth=5, random_state=42, verbose=-1),
            "CatBoost": CatBoostRegressor(iterations=100, learning_rate=0.05, depth=5, random_seed=42, verbose=0)
        }

    def get_classification_models(self) -> Dict[str, Any]:
        return {
            "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
            "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1),
            "XGBoost": XGBClassifier(n_estimators=100, learning_rate=0.05, max_depth=5, random_state=42, eval_metric='logloss', n_jobs=-1),
            "LightGBM": LGBMClassifier(n_estimators=100, learning_rate=0.05, max_depth=5, random_state=42, verbose=-1),
            "CatBoost": CatBoostClassifier(iterations=100, learning_rate=0.05, depth=5, random_seed=42, verbose=0)
        }

    def train_all(self, dataset_path: str = None) -> Dict[str, Any]:
        if not dataset_path or not os.path.exists(dataset_path):
            dataset_path = os.path.join(DATA_DIR, "financial_dataset.csv")
            if not os.path.exists(dataset_path):
                df = generate_synthetic_dataset(num_samples=2500)
                df.to_csv(dataset_path, index=False)
            else:
                df = pd.read_csv(dataset_path)
        else:
            df = pd.read_csv(dataset_path)

        # Fit preprocessor
        X_trans = self.preprocessor.fit_transform(df)

        # Targets
        y_reg = df["financial_health_score"].values
        y_cls = df["emi_default_flag"].values

        # 1. Train & Evaluate Regressors (Predicting Health Score)
        reg_models = self.get_regression_models()
        reg_results = {}
        best_reg_r2 = -float("inf")

        kf = KFold(n_splits=5, shuffle=True, random_state=42)

        for name, model in reg_models.items():
            r2_scores = cross_val_score(model, X_trans, y_reg, cv=kf, scoring='r2')
            avg_r2 = float(np.mean(r2_scores))

            # Fit on full set for final metrics
            model.fit(X_trans, y_reg)
            y_pred = model.predict(X_trans)

            mae = float(mean_absolute_error(y_reg, y_pred))
            mse = float(mean_squared_error(y_reg, y_pred))
            rmse = float(np.sqrt(mse))
            mape = float(mean_absolute_percentage_error(y_reg, y_pred))

            reg_results[name] = {
                "cv_r2_mean": round(avg_r2, 4),
                "mae": round(mae, 4),
                "mse": round(mse, 4),
                "rmse": round(rmse, 4),
                "r2_score": round(float(r2_score(y_reg, y_pred)), 4),
                "mape": round(mape, 4)
            }

            if avg_r2 > best_reg_r2:
                best_reg_r2 = avg_r2
                self.best_regressor = model
                self.best_regressor_name = name

        # 2. Train & Evaluate Classifiers (Predicting EMI Default Risk)
        cls_models = self.get_classification_models()
        cls_results = {}
        best_cls_f1 = -float("inf")

        skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

        for name, model in cls_models.items():
            f1_scores = cross_val_score(model, X_trans, y_cls, cv=skf, scoring='f1')
            avg_f1 = float(np.mean(f1_scores))

            model.fit(X_trans, y_cls)
            y_pred = model.predict(X_trans)
            y_prob = model.predict_proba(X_trans)[:, 1] if hasattr(model, "predict_proba") else y_pred

            acc = float(accuracy_score(y_cls, y_pred))
            prec = float(precision_score(y_cls, y_pred, zero_division=0))
            rec = float(recall_score(y_cls, y_pred, zero_division=0))
            f1 = float(f1_score(y_cls, y_pred, zero_division=0))
            auc = float(roc_auc_score(y_cls, y_prob))
            cm = confusion_matrix(y_cls, y_pred).tolist()

            cls_results[name] = {
                "cv_f1_mean": round(avg_f1, 4),
                "accuracy": round(acc, 4),
                "precision": round(prec, 4),
                "recall": round(rec, 4),
                "f1_score": round(f1, 4),
                "roc_auc": round(auc, 4),
                "confusion_matrix": cm
            }

            if avg_f1 > best_cls_f1:
                best_cls_f1 = avg_f1
                self.best_classifier = model
                self.best_classifier_name = name

        # Save artifacts
        joblib.dump(self.preprocessor, os.path.join(MODELS_DIR, "preprocessor.joblib"))
        joblib.dump({"name": self.best_regressor_name, "model": self.best_regressor}, os.path.join(MODELS_DIR, "best_regressor.joblib"))
        joblib.dump({"name": self.best_classifier_name, "model": self.best_classifier}, os.path.join(MODELS_DIR, "best_classifier.joblib"))

        self.metrics_summary = {
            "best_regressor": self.best_regressor_name,
            "best_classifier": self.best_classifier_name,
            "regression_metrics": reg_results,
            "classification_metrics": cls_results,
            "total_samples": len(df),
            "features_count": len(self.preprocessor.feature_names)
        }

        # Save metrics json
        joblib.dump(self.metrics_summary, os.path.join(MODELS_DIR, "metrics_summary.joblib"))
        return self.metrics_summary

if __name__ == "__main__":
    trainer = ModelTrainer()
    summary = trainer.train_all()
    print("Training Complete!")
    print(f"Best Regressor: {summary['best_regressor']}")
    print(f"Best Classifier: {summary['best_classifier']}")
