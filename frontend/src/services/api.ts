import axios from 'axios';
import { FinancialProfileInput, PredictionResponse, DashboardAnalytics, ModelMetricsSummary } from '../types/financial';

const API_BASE_URL = '/api/v1';

export const financialApi = {
  predict: async (data: FinancialProfileInput): Promise<PredictionResponse> => {
    const response = await axios.post<PredictionResponse>(`${API_BASE_URL}/predict`, data);
    return response.data;
  },

  getDashboardData: async (): Promise<DashboardAnalytics> => {
    const response = await axios.get<DashboardAnalytics>(`${API_BASE_URL}/dashboard`);
    return response.data;
  },

  getMetrics: async (): Promise<ModelMetricsSummary> => {
    const response = await axios.get<ModelMetricsSummary>(`${API_BASE_URL}/metrics`);
    return response.data;
  },

  getModelInfo: async () => {
    const response = await axios.get(`${API_BASE_URL}/model-info`);
    return response.data;
  },

  trainModels: async () => {
    const response = await axios.post(`${API_BASE_URL}/train`);
    return response.data;
  }
};
