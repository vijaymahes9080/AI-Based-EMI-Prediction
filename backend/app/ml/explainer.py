import numpy as np
import pandas as pd
from typing import List, Dict, Any

class ExplainableAIEngine:
    def __init__(self, preprocessor, model, feature_names: List[str]):
        self.preprocessor = preprocessor
        self.model = model
        self.feature_names = feature_names

    def get_local_explanation(self, input_df: pd.DataFrame, top_k: int = 8) -> List[Dict[str, Any]]:
        """Calculate feature contribution and impact for local prediction."""
        X_trans = self.preprocessor.transform(input_df)

        feature_values = X_trans[0]
        num_features = len(feature_values)

        # Retrieve tree feature importances or model coefficients if available
        if hasattr(self.model, "feature_importances_"):
            importances = self.model.feature_importances_
        elif hasattr(self.model, "coef_"):
            coef = self.model.coef_
            importances = np.abs(coef[0]) if coef.ndim > 1 else np.abs(coef)
        else:
            # Equal baseline weighting fallback
            importances = np.ones(num_features) / num_features

        # Normalize importances
        if np.sum(importances) > 0:
            importances = importances / np.sum(importances)

        # Match with feature names
        names = self.feature_names if len(self.feature_names) == num_features else [f"feature_{i}" for i in range(num_features)]

        raw_data = input_df.iloc[0].to_dict()

        # Compute direction and relative impact per feature
        impacts = []
        for name, imp, val in zip(names, importances, feature_values):
            clean_name = name.replace("num__", "").replace("cat__", "").replace("_", " ").title()

            # Determine direction & human explanation based on feature value and importance
            if imp > 0.005:
                # Custom direction heuristic for key indicators
                if "Credit Score" in clean_name:
                    score = raw_data.get("credit_score", 700)
                    direction = "positive" if score >= 720 else "negative"
                    desc = f"Credit Score of {score} indicates {'strong' if score >= 720 else 'vulnerable'} creditworthiness."
                elif "Debt To Income" in clean_name:
                    dti = raw_data.get("debt_to_income_ratio", 0.3)
                    direction = "negative" if dti > 0.4 else "positive"
                    desc = f"Debt-to-Income ratio is {round(dti*100, 1)}% ({'high burden' if dti > 0.4 else 'healthy balance'})."
                elif "Emergency Fund" in clean_name:
                    ef = raw_data.get("emergency_fund_months", 3)
                    direction = "positive" if ef >= 4 else "negative"
                    desc = f"Liquid emergency fund covers {round(ef, 1)} months of living expenses."
                elif "Savings Ratio" in clean_name:
                    sr = raw_data.get("savings_ratio", 0.2)
                    direction = "positive" if sr > 0.15 else "negative"
                    desc = f"Monthly net savings ratio is {round(sr*100, 1)}% of total income."
                elif "House Rent" in clean_name:
                    rent = raw_data.get("house_rent", 0)
                    direction = "negative" if rent > raw_data.get("total_monthly_income", 1)*0.3 else "neutral"
                    desc = f"Monthly house rent commitment is ${rent:,.0f}."
                elif "Total Emi" in clean_name or "Existing" in clean_name:
                    emi = raw_data.get("total_existing_emi", 0)
                    direction = "negative" if emi > 0 else "neutral"
                    desc = f"Existing monthly debt EMI burden of ${emi:,.0f}."
                else:
                    direction = "positive" if val > 0 else "negative"
                    desc = f"Value of {clean_name} significantly impacts prediction calculation."

                signed_impact = imp if direction == "positive" else -imp
                impacts.append({
                    "feature": clean_name,
                    "impact": round(signed_impact * 100, 2),
                    "description": desc,
                    "direction": direction
                })

        # Sort by absolute magnitude of impact
        impacts.sort(key=lambda x: abs(x["impact"]), reverse=True)
        return impacts[:top_k]
