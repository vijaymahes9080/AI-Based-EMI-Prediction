from fastapi import APIRouter
from app.api.v1 import auth, predict, metrics, dashboard

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(predict.router, tags=["predict"])
api_router.include_router(metrics.router, tags=["metrics"])
api_router.include_router(dashboard.router, tags=["dashboard"])
