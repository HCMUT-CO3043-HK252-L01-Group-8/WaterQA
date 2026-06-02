import api from "./apiConfig";
import { ApiResponse } from "./authServices";

export const deviceServices = {
    getAllDevices: (signal?: AbortSignal) => {
        return api.get<any, ApiResponse>("/devices", { signal });
    },

    getDeviceById: (id: number | string, signal?: AbortSignal) => {
        return api.get<any, ApiResponse>(`/devices/${id}`, { signal });
    },

    createDevice: (data: { station_id: number; sensor_name: string; sensor_type: string; unit: string; status: string }, signal?: AbortSignal) => {
        return api.post<any, ApiResponse>("/devices", data, { signal });
    },

    updateDevice: (id: number | string, data: any, signal?: AbortSignal) => {
        return api.put<any, ApiResponse>(`/devices/${id}`, data, { signal });
    },

    renameDevice: (id: number | string, newName: string, signal?: AbortSignal) => {
        return api.patch<any, ApiResponse>(`/devices/${id}/name`, { newName }, { signal });
    },

    deleteDevice: (id: number | string, signal?: AbortSignal) => {
        return api.delete<any, ApiResponse>(`/devices/${id}`, { signal });
    }
};