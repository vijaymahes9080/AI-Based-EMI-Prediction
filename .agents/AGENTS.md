# Workspace Agent Rules & Guidelines

## 1. Architectural Principles
- **FastAPI Backend**: All API endpoints must be placed under `/backend/app/api/v1/`. Use Pydantic schemas for data validation.
- **Machine Learning Suite**: Preprocessing, model training, SHAP explainability, and recommendation logic must reside under `/backend/app/ml/`.
- **React Frontend**: Components must be modular, strongly-typed in TypeScript, styled with Tailwind CSS, and located under `/frontend/src/components/`.

## 2. Code Quality & Security
- Never commit hardcoded secrets. Use environment variables via `backend/app/core/config.py`.
- Maintain full 5-fold cross-validation when evaluating model performance.
- Ensure all new API endpoints have corresponding pytest tests in `/backend/tests/`.
