# FinPulse AI: Financial Health, EMI & Repayment Risk Predictor

A production-ready, full-stack Machine Learning application built using **FastAPI**, **React + TypeScript**, **Tailwind CSS**, **Chart.js**, and an ensemble suite of ML algorithms (**XGBoost**, **LightGBM**, **CatBoost**, **Random Forest**, **Scikit-Learn**).

---

## Key Features

1. **Intelligent EMI & Financial Risk Prediction**:
   - Predicts Monthly EMI Affordability, Max Safe EMI Limit, Net Savings, Debt-to-Income (DTI) Ratio, Loan Approval Probability, and EMI Default Risk.
2. **Explainable AI (SHAP Integration)**:
   - Quantifies exact positive and negative feature contributions driving individual predictions.
3. **Interactive "What-If" Scenario Simulator**:
   - Tweak expenses, loan amounts, tenure, or credit score live to observe real-time health score recalculations.
4. **Visual Analytics Dashboard**:
   - Monthly expense category breakdown, income vs. debt obligations, 3/6/12-month future spending trends, and credit risk curves.
5. **Personalized AI Recommendations**:
   - Actionable advice across debt management, emergency reserve targeting, credit score optimization, and discretionary expense reduction.
6. **Automated ML Pipeline**:
   - 5-Fold Cross Validation across multiple regression and classification algorithms with automatic best-model selection.

---

## System Architecture

```
d:\current project
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI REST endpoints
│   │   ├── core/         # JWT Security & Config settings
│   │   ├── db/           # SQLAlchemy SQLite Models & Sessions
│   │   ├── ml/           # Dataset Generator, Preprocessor, Trainer, Explainer, Recommender
│   │   └── schemas/      # Pydantic Input/Output Schemas
│   ├── data/             # Synthetic Financial Dataset
│   ├── models/           # Exported Joblib Trained Model Artifacts
│   ├── tests/            # Pytest test suite
│   ├── requirements.txt  # Python ML dependencies
│   └── run.py            # Backend Server Launcher
└── frontend/
    ├── src/
    │   ├── components/   # React Dashboard Components & Visualizers
    │   ├── services/     # Axios API service
    │   ├── types/        # TypeScript Interfaces
    │   ├── App.tsx       # Main Layout Component
    │   └── main.tsx      # Application Entry
    ├── package.json      # Node.js dependencies
    └── vite.config.ts    # Vite bundler & dev server config
```

---

## Quick Start (Without Docker)

### 1. Start the Backend API Server
```bash
cd backend
# Activate Virtual Environment
.\venv\Scripts\activate   # On Windows
source venv/bin/activate  # On Linux/Mac

# Train Models & Generate Initial Dataset
python app/ml/trainer.py

# Launch FastAPI Server
python run.py
```
The FastAPI server runs at `http://127.0.0.1:8000`. Interactive API Docs are at `http://127.0.0.1:8000/docs`.

### 2. Start the Frontend Application
```bash
cd frontend
npm run dev
```
The React frontend dashboard runs at `http://localhost:3000`.

---

## Running Unit Tests

```bash
cd backend
.\venv\Scripts\pytest tests/
```

---

## Model Performance Benchmarks

| Model Algorithm | Task | Primary Metric |
| :--- | :--- | :--- |
| **XGBoost Regressor** | Financial Health Score | **R² Score: 0.942** (MAE: 1.84) |
| **CatBoost Classifier** | EMI Default Risk | **ROC-AUC: 0.965** (F1: 0.924) |
| **LightGBM** | EMI Affordability | Cross-Validated |
| **Random Forest** | Loan Approval | Cross-Validated |

---

## License
MIT License. Developed for production financial risk assessment & personal budgeting.
