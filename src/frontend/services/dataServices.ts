import api from "./apiConfig";
import { ApiResponse } from "./authServices";

export const dataServices = {
    getHistory: (rowLimit?: number, signal?: AbortSignal) => {
        return api.get<any, ApiResponse>("/data/history", {
            params: rowLimit ? { rowLimit } : {},
            signal,
        });
    },
};