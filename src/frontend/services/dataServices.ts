import api from "./apiConfig";
import { ApiResponse } from "./authServices";

export const dataServices = {
    getHistory: (rowLimit?: number, signal?: AbortSignal) => {
        return api.get<any, ApiResponse>("/data/history", {
            params: rowLimit ? { rowLimit } : {},
            signal,
        });
    },

    exportData: (rowLimit?: number, signal?: AbortSignal) => {
        return api.get<any, any>("/data/export", {
            params: rowLimit ? { rowLimit } : {},
            responseType: "blob",
            signal,
        });
    },

    getLatestObservation: (station_id?: number, signal?: AbortSignal) => {
        return api.get<any, ApiResponse>("/data/latest", {
            params: station_id ? { station_id } : {},
            signal,
        });
    }
};