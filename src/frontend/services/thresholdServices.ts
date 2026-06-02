import api from "./apiConfig";
import { ApiResponse } from "./authServices";

export interface ThresholdData {
    parameter: string;
    lower_threshold: number;
    upper_threshold: number;
    severity: string;
    station?: string | number;
}

export const thresholdServices = {
    getAllThresholds: (signal?: AbortSignal) => {
        return api.get<any, ApiResponse>("/data/thresholds-api", { signal });
    },

    getThresholdById: (id: number | string, signal?: AbortSignal) => {
        return api.get<any, ApiResponse>(`/data/thresholds/${id}`, { signal });
    },

    createThreshold: (data: ThresholdData, signal?: AbortSignal) => {
        return api.post<any, ApiResponse>("/data/thresholds", data, { signal });
    },

    updateThreshold: (id: number | string, data: ThresholdData, signal?: AbortSignal) => {
        return api.put<any, ApiResponse>(`/data/thresholds/${id}`, data, { signal });
    },

    deleteThreshold: (id: number | string, signal?: AbortSignal) => {
        return api.delete<any, ApiResponse>(`/data/thresholds/${id}`, { signal });
    }
};