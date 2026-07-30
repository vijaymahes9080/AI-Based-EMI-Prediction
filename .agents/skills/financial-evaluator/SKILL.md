---
name: financial-evaluator
description: Skill for evaluating financial input metrics, calculating DTI ratios, and validating SHAP explainability.
---

# Financial Evaluator Skill Instructions

1. **Calculate Ratios**:
   - `DTI` = `Total Monthly Debt Obligations` / `Gross Monthly Income`
   - `Disposable Income` = `Gross Income` - `Living Expenses` - `Existing Debt EMI`
   - `Financial Stability Index` = `Credit Score Contribution` + `Emergency Reserve Contribution` + `DTI Balance`

2. **Model Validation**:
   - Verify XGBoost, LightGBM, and CatBoost models maintain R² > 0.90 for regression and F1 > 0.88 for classification.
