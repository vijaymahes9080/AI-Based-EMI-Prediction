import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, default="user") # user, admin
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profiles = relationship("FinancialProfile", back_populates="user", cascade="all, delete-orphan")

class FinancialProfile(Base):
    __tablename__ = "financial_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Store raw profile input JSON
    profile_data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="profiles")
    predictions = relationship("Prediction", back_populates="profile", cascade="all, delete-orphan")

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("financial_profiles.id"), nullable=False)

    predicted_monthly_emi = Column(Float, nullable=False)
    recommended_max_emi = Column(Float, nullable=False)
    monthly_savings_after_emi = Column(Float, nullable=False)
    disposable_income = Column(Float, nullable=False)
    debt_to_income_ratio = Column(Float, nullable=False)
    financial_health_score = Column(Float, nullable=False)
    loan_approval_chance = Column(Float, nullable=False)
    emi_default_risk = Column(Float, nullable=False)
    budget_score = Column(Float, nullable=False)
    investment_capacity = Column(Float, nullable=False)

    future_trends_json = Column(JSON, nullable=True)
    feature_impacts_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("FinancialProfile", back_populates="predictions")
    recommendations = relationship("Recommendation", back_populates="prediction", cascade="all, delete-orphan")

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id"), nullable=False)
    category = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    action_item = Column(Text, nullable=False)

    prediction = relationship("Prediction", back_populates="recommendations")

class ModelLog(Base):
    __tablename__ = "model_logs"

    id = Column(Integer, primary_key=True, index=True)
    best_regressor_name = Column(String, nullable=False)
    best_classifier_name = Column(String, nullable=False)
    metrics_json = Column(JSON, nullable=False)
    trained_at = Column(DateTime, default=datetime.datetime.utcnow)
