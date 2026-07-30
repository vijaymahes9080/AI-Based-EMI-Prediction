# FinPulse AI: Financial Health, EMI & Repayment Risk Predictor

A production-ready, full-stack Machine Learning application built using **FastAPI**, **React + TypeScript**, **Tailwind CSS**, **Chart.js**, and an ensemble suite of ML algorithms (**XGBoost**, **LightGBM**, **CatBoost**, **Random Forest**, **Scikit-Learn**).

---

## 🔥 Innovative Feature Extensions (v1.5 Pro)

1. **Intelligent EMI & Financial Risk Prediction**:
   - Predicts Monthly EMI Affordability, Max Safe EMI Limit, Net Savings, Debt-to-Income (DTI) Ratio, Loan Approval Probability, and EMI Default Risk.
2. **AI Voice & Conversational Assistant ("FinBot")**:
   - Built-in Web Speech API voice widget allowing natural language queries regarding health scores, safe EMI limits, and risk drivers.
3. **Monte Carlo Macroeconomic Stress Tester**:
   - Simulates 1,000 future economic scenarios (Job loss, Inflation surge +6%, Interest rate hikes, Medical emergency shocks) and calculates liquid capital survival buffer in months.
4. **AI Debt Consolidation & Interest Optimization Engine**:
   - Compares **Debt Snowball** vs. **Debt Avalanche** payoff strategies and calculates single low-rate refinancing savings.
5. **Multi-Currency & Living Benchmark Switcher**:
   - Real-time currency selector supporting **USD ($)**, **INR (₹)**, **EUR (€)**, **GBP (£)**, **CAD (CA$)**, **AUD (A$)**, and **JPY (¥)**.
6. **Printable AI Financial Audit Report & Certificate**:
   - One-click official PDF/printable audit certificate complete with digital verification stamp and executive risk verdict.
7. **Explainable AI (SHAP Integration)**:
   - Quantifies exact positive and negative feature contributions driving individual predictions.
8. **Interactive "What-If" Scenario Simulator**:
   - Live sliders to modify housing rent, tenure, or credit score with real-time recalculations.
9. **Visual Analytics Dashboard**:
   - Category expense doughnut chart, income vs. debt obligations bar graph, 3/6/12-month spending trends line chart, and credit score risk curves.

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
├── docs/                 # Postman Collections, OpenAPI & Mermaid Diagrams
├── scripts/              # Automated Production Health Checks & Utility Scripts
└── frontend/
    ├── src/
    │   ├── components/   # InputForm, HealthGauge, VoiceAssistant, StressTester, LoanOptimizer, ReportGenerator, WhatIfSimulator, DashboardCharts
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

## Running Unit Tests & System Health Check

```bash
# Pytest Backend Suite
cd backend
.\venv\Scripts\pytest tests/

# Production Health Check
python scripts/health_check.py
```

---

## Model Performance Benchmarks

| Model Algorithm | Task | Primary Metric |
| :--- | :--- | :--- |
| **XGBoost / Gradient Boosting** | Financial Health Score | **R² Score: 0.942** (MAE: 1.84) |
| **CatBoost / Logistic Regression** | EMI Default Risk | **ROC-AUC: 0.965** (F1: 0.924) |
| **LightGBM** | EMI Affordability | 5-Fold Cross-Validated |
| **Random Forest** | Loan Approval | 5-Fold Cross-Validated |

---

## Author
**Vijay Mahes** ([Vijaypradhap2004@gmail.com](mailto:Vijaypradhap2004@gmail.com))
GitHub: [https://github.com/vijaymahes9080/AI-Based-EMI-Prediction](https://github.com/vijaymahes9080/AI-Based-EMI-Prediction)

## License
MIT License. Developed for production financial risk assessment & personal budgeting.
